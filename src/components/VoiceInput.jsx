import { useState, useEffect, useRef } from 'react';
import { VoiceRecognition, isSpeechRecognitionSupported } from '../services/speechRecognition';
import { parseTaskFromSpeech } from '../services/taskParser';
import './VoiceInput.css';

function VoiceInput({ onTaskParsed, compact = false }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setError('La reconnaissance vocale n\'est pas supportée par votre navigateur');
      return;
    }

    try {
      const recognition = new VoiceRecognition();

      recognition.onStart(() => {
        setIsListening(true);
        setTranscript('');
        setError(null);
      });

      recognition.onResult((text) => {
        setTranscript(text);
        const parsedTask = parseTaskFromSpeech(text);
        onTaskParsed(parsedTask);
      });

      recognition.onError((err) => {
        setError(`Erreur: ${err}`);
        setIsListening(false);
      });

      recognition.onEnd(() => {
        setIsListening(false);
      });

      recognitionRef.current = recognition;
    } catch (err) {
      setError('Impossible d\'initialiser la reconnaissance vocale');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTaskParsed]);

  const handleToggleListen = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  // Mode compact : juste un petit bouton
  if (compact) {
    return (
      <button
        type="button"
        className={`voice-button-compact ${isListening ? 'listening' : ''}`}
        onClick={handleToggleListen}
        title={isListening ? 'Arrêter l\'écoute' : 'Saisie vocale'}
      >
        {isListening ? '⏹️' : '🎤'}
      </button>
    );
  }

  // Mode normal : avec feedback complet
  return (
    <div className="voice-input">
      <button
        type="button"
        className={`voice-button ${isListening ? 'listening' : ''}`}
        onClick={handleToggleListen}
        title={isListening ? 'Arrêter l\'écoute' : 'Commencer l\'écoute vocale'}
      >
        {isListening ? '⏹️' : '🎤'}
      </button>

      {isListening && (
        <div className="voice-status">
          <span className="pulse"></span>
          <span>Écoute en cours...</span>
        </div>
      )}

      {transcript && !isListening && (
        <div className="voice-transcript">
          <span>Vous avez dit: "{transcript}"</span>
        </div>
      )}

      {error && (
        <div className="voice-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default VoiceInput;
