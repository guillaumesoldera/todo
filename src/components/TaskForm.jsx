import { useState } from 'react';
import VoiceInput from './VoiceInput';
import './TaskForm.css';

// Formatte une date pour l'input datetime-local (en heure locale)
const formatDateTimeLocal = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function TaskForm({ onAdd, onClose }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    urgent: false,
    important: false,
    reminderDate: null,
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;

    onAdd(task);
    setTask({
      title: '',
      description: '',
      urgent: false,
      important: false,
      reminderDate: null,
    });
  };

  const handleVoiceParsed = (parsedTask) => {
    setTask(prevTask => ({
      ...prevTask,
      title: parsedTask.title || prevTask.title,
      urgent: parsedTask.urgent,
      important: parsedTask.important,
      reminderDate: parsedTask.reminderDate || prevTask.reminderDate,
    }));
  };

  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="task-form-header">
          <h2>Nouvelle tâche</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          {/* Titre avec bouton vocal inline */}
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <div className="title-input-container">
              <input
                id="title"
                type="text"
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Que ne devez-vous pas oublier ?"
                autoFocus
                required
              />
              <VoiceInput onTaskParsed={handleVoiceParsed} compact />
            </div>
          </div>

          {/* Classification compacte */}
          <div className="form-group">
            <label>Priorité</label>
            <div className="classification-compact">
              <button
                type="button"
                className={`priority-btn urgent-important ${task.urgent && task.important ? 'active' : ''}`}
                onClick={() => setTask({ ...task, urgent: true, important: true })}
              >
                <span className="priority-emoji">🔴</span>
                <span className="priority-label">Urgent<br/>Important</span>
              </button>
              <button
                type="button"
                className={`priority-btn not-urgent-important ${!task.urgent && task.important ? 'active' : ''}`}
                onClick={() => setTask({ ...task, urgent: false, important: true })}
              >
                <span className="priority-emoji">🔵</span>
                <span className="priority-label">Important</span>
              </button>
              <button
                type="button"
                className={`priority-btn urgent-not-important ${task.urgent && !task.important ? 'active' : ''}`}
                onClick={() => setTask({ ...task, urgent: true, important: false })}
              >
                <span className="priority-emoji">🟡</span>
                <span className="priority-label">Urgent</span>
              </button>
              <button
                type="button"
                className={`priority-btn not-urgent-not-important ${!task.urgent && !task.important ? 'active' : ''}`}
                onClick={() => setTask({ ...task, urgent: false, important: false })}
              >
                <span className="priority-emoji">🟢</span>
                <span className="priority-label">À<br/>planifier</span>
              </button>
            </div>
          </div>

          {/* Indicateur de rappel si défini */}
          {task.reminderDate && !showMoreOptions && (
            <div className="reminder-indicator">
              🔔 Rappel défini : {new Date(task.reminderDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}

          {/* Plus d'options */}
          <button
            type="button"
            className="more-options-toggle"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
          >
            {showMoreOptions ? '▲' : '▼'} Plus d'options
          </button>

          {showMoreOptions && (
            <div className="more-options">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={task.description}
                  onChange={(e) => setTask({ ...task, description: e.target.value })}
                  placeholder="Détails supplémentaires (optionnel)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reminder">Rappel</label>
                <input
                  id="reminder"
                  type="datetime-local"
                  value={formatDateTimeLocal(task.reminderDate)}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      reminderDate: e.target.value ? new Date(e.target.value).getTime() : null,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Ajouter
            </button>
            <button type="button" className="btn-cancel-form" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
