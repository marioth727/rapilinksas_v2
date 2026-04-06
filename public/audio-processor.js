/**
 * AudioWorkletProcessor para capturar audio PCM estéreo/mono a los rates necesarios.
 */
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      
      // Convertir Float32 a Int16 (PCM) requerido por Gemini
      const pcmData = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
      this.port.postMessage(pcmData);
    }
    return true; // Mantener vivo el procesador
  }
}

registerProcessor('audio-processor', AudioProcessor);
