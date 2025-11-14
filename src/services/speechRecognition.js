// Service de reconnaissance vocale utilisant Web Speech API

export const isSpeechRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export class VoiceRecognition {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onStartCallback = null;
    this.onEndCallback = null;

    this._setupEventHandlers();
  }

  _setupEventHandlers() {
    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStartCallback) this.onStartCallback();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResultCallback) this.onResultCallback(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onErrorCallback) this.onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) this.onEndCallback();
    };
  }

  start() {
    if (!this.isListening) {
      this.recognition.start();
    }
  }

  stop() {
    if (this.isListening) {
      this.recognition.stop();
    }
  }

  onResult(callback) {
    this.onResultCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  onStart(callback) {
    this.onStartCallback = callback;
  }

  onEnd(callback) {
    this.onEndCallback = callback;
  }
}
