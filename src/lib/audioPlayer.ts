import { base64ToArrayBuffer } from './base64Utils';

export class AudioPlayer {
  private audioContext: AudioContext;
  private nextPlayTime: number = 0;

  constructor() {
    this.audioContext = new AudioContext({ sampleRate: 24000 });
  }

  // Must be called inside a user gesture!
  async initialize() {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playBase64(base64Data: string) {
    if (this.audioContext.state === 'suspended') {
      try {
          await this.audioContext.resume();
      } catch (e) {
          console.warn("Could not resume AudioContext:", e);
      }
    }

    const arrayBuffer = base64ToArrayBuffer(base64Data);
    const int16Array = new Int16Array(arrayBuffer);
    
    // Gemini devuelve PCM 16 bits. AudioContext espera Float32 (-1.0 a 1.0)
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    
    // Evitar cortes sincronizando el tiempo de reproducción. 
    // Agregamos un pequeñísimo margen de latencia inicial en el primer gap para pre-encolar buffs
    if (this.nextPlayTime < currentTime) {
      this.nextPlayTime = currentTime + 0.05; 
    }

    source.start(this.nextPlayTime);
    this.nextPlayTime += audioBuffer.duration;
  }

  stop() {
    // Cierra el contexto para cortar cualquier reproducción actual
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    // Reinicializamos listos para un siguiente turno
    this.audioContext = new AudioContext({ sampleRate: 24000 });
    this.nextPlayTime = 0;
  }
}
