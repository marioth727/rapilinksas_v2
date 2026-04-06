import { arrayBufferToBase64 } from './base64Utils';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private onDataCallback: ((base64: string) => void) | null = null;

  constructor(onData: (base64: string) => void) {
    this.onDataCallback = onData;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      await this.audioContext.audioWorklet.addModule('/audio-processor.js');

      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-processor');

      let chunkCount = 0;
      this.workletNode.port.onmessage = (event) => {
        const pcmData = event.data as Int16Array;
        const base64 = arrayBufferToBase64(pcmData.buffer as ArrayBuffer);
        if (chunkCount < 5) {
          console.log(`[RECORDER] Chunk #${++chunkCount} enviado (${pcmData.length} samples)`);
        } else {
          chunkCount++;
        }
        if (this.onDataCallback) {
          this.onDataCallback(base64);
        }
      };

      // ⚠️ NO conectar al destination — eso haría eco del micro a los parlantes
      // Solo conectamos source → worklet (captura sin reproducir)
      source.connect(this.workletNode);
    } catch (error) {
      console.error('Error al iniciar AudioRecorder:', error);
      throw error;
    }
  }

  stop() {
    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }
}
