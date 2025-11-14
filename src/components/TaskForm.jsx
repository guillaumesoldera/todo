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
          <VoiceInput onTaskParsed={handleVoiceParsed} />

          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              id="title"
              type="text"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              placeholder="Que ne devez-vous pas oublier ?"
              autoFocus
              required
            />
          </div>

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
            <label>Classification</label>
            <div className="classification-grid">
              <label className="classification-item urgent-important">
                <input
                  type="radio"
                  name="classification"
                  checked={task.urgent && task.important}
                  onChange={() => setTask({ ...task, urgent: true, important: true })}
                />
                <div className="classification-label">
                  <strong>Urgent & Important</strong>
                  <span>À faire immédiatement</span>
                </div>
              </label>

              <label className="classification-item not-urgent-important">
                <input
                  type="radio"
                  name="classification"
                  checked={!task.urgent && task.important}
                  onChange={() => setTask({ ...task, urgent: false, important: true })}
                />
                <div className="classification-label">
                  <strong>Important</strong>
                  <span>À planifier</span>
                </div>
              </label>

              <label className="classification-item urgent-not-important">
                <input
                  type="radio"
                  name="classification"
                  checked={task.urgent && !task.important}
                  onChange={() => setTask({ ...task, urgent: true, important: false })}
                />
                <div className="classification-label">
                  <strong>Urgent</strong>
                  <span>À déléguer si possible</span>
                </div>
              </label>

              <label className="classification-item not-urgent-not-important">
                <input
                  type="radio"
                  name="classification"
                  checked={!task.urgent && !task.important}
                  onChange={() => setTask({ ...task, urgent: false, important: false })}
                />
                <div className="classification-label">
                  <strong>À planifier</strong>
                  <span>Quand vous avez du temps</span>
                </div>
              </label>
            </div>
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

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Ajouter la tâche
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
