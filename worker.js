import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.0';

let transcriber = null;

const CHUNK_LENGTH_S = 30;  // 30 seconds chunk length
const STRIDE_S = 5;         // 5 seconds overlap stride
const SAMPLE_RATE = 16000;  // 16kHz sample rate

self.onmessage = async (e) => {
  const { action, data } = e.data;

  try {
    if (action === 'loadModel') {
      transcriber = await pipeline('automatic-speech-recognition', `Xenova/whisper-${data.modelName}`, {
        dtype: 'q8',
        device: 'wasm',
        beam_width: 3,           // Enable beam search for accuracy
      });
      self.postMessage({ action: 'modelLoaded' });
    } else if (action === 'transcribe') {
      const resultChunks = [];
      const audioBuffer = data.audioBuffer;
      const totalLength = audioBuffer.length;
      const chunkSize = CHUNK_LENGTH_S * SAMPLE_RATE;
      const strideSize = STRIDE_S * SAMPLE_RATE;

      for (let start = 0; start < totalLength; ) {
        const end = Math.min(start + chunkSize, totalLength);
        const chunkAudio = audioBuffer.slice(start, end);

        // Transcribe each overlapping chunk
        const transcription = await transcriber(chunkAudio, {
          return_timestamps: true,
        });

        // Collect chunks for merging later
        resultChunks.push(...(transcription.chunks || [transcription]));

        // Send progress based on audio consumed
        const progress = Math.min(100, Math.floor((end / totalLength) * 100));
        self.postMessage({ action: 'progress', progress });

        // Move start pos with stride overlap for next chunk
        start += (chunkSize - strideSize);

        // Non-blocking pause to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Post full merged chunk list
      self.postMessage({ action: 'transcriptionResult', result: { chunks: resultChunks } });
    } else if (action === 'translate') {
      const resp = await fetch(data.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: data.text,
          source: data.sourceLang,
          target: data.targetLang,
          format: 'text',
          api_key: data.apiKey || undefined,
        }),
      });
      if (!resp.ok) throw new Error('Translation failed');
      const json = await resp.json();
      self.postMessage({ action: 'translationResult', translatedText: json.translatedText, index: data.index });
    }
  } catch (err) {
    self.postMessage({ action: 'error', message: err.message });
  }
};
