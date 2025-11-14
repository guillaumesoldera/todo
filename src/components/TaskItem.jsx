import { useState } from 'react';
import './TaskItem.css';

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

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  const getCategoryColor = () => {
    if (task.urgent && task.important) return 'var(--color-urgent-important)';
    if (!task.urgent && task.important) return 'var(--color-not-urgent-important)';
    if (task.urgent && !task.important) return 'var(--color-urgent-not-important)';
    return 'var(--color-not-urgent-not-important)';
  };

  const getCategoryLabel = () => {
    if (task.urgent && task.important) return 'Urgent & Important';
    if (!task.urgent && task.important) return 'Important';
    if (task.urgent && !task.important) return 'Urgent';
    return 'À planifier';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <div className="task-item editing" style={{ borderLeftColor: getCategoryColor() }}>
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            placeholder="Titre de la tâche"
          />
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            placeholder="Description (optionnelle)"
            rows="3"
          />
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={editedTask.urgent}
                onChange={(e) => setEditedTask({ ...editedTask, urgent: e.target.checked })}
              />
              Urgent
            </label>
            <label>
              <input
                type="checkbox"
                checked={editedTask.important}
                onChange={(e) => setEditedTask({ ...editedTask, important: e.target.checked })}
              />
              Important
            </label>
          </div>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(editedTask.reminderDate)}
            onChange={(e) =>
              setEditedTask({
                ...editedTask,
                reminderDate: e.target.value ? new Date(e.target.value).getTime() : null,
              })
            }
          />
          <div className="button-group">
            <button className="btn-save" onClick={handleSave}>
              Enregistrer
            </button>
            <button className="btn-cancel" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      style={{ borderLeftColor: getCategoryColor() }}
    >
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <h3 className="task-title">{task.title}</h3>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        <span className="task-category" style={{ color: getCategoryColor() }}>
          {getCategoryLabel()}
        </span>
        {task.reminderDate && (
          <span className="task-reminder">
            🔔 {formatDate(task.reminderDate)}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          ✏️ Modifier
        </button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
