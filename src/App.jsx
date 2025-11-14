import { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from './services/db';
import {
  requestNotificationPermission,
  checkReminders,
  scheduleNotification,
} from './services/notifications';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [notificationTimers, setNotificationTimers] = useState({});

  useEffect(() => {
    loadTasks();
    requestNotificationPermission();

    const interval = setInterval(() => {
      checkAndNotifyReminders();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadTasks = async () => {
    const allTasks = await getAllTasks();
    setTasks(allTasks);
    scheduleAllNotifications(allTasks);
  };

  const scheduleAllNotifications = (taskList) => {
    Object.values(notificationTimers).forEach((timer) => clearTimeout(timer));

    const timers = {};
    taskList.forEach((task) => {
      if (task.reminderDate && !task.completed) {
        const timer = scheduleNotification(task);
        if (timer) {
          timers[task.id] = timer;
        }
      }
    });
    setNotificationTimers(timers);
  };

  const checkAndNotifyReminders = async () => {
    const allTasks = await getAllTasks();
    const tasksToNotify = await checkReminders(allTasks);

    tasksToNotify.forEach(async (task) => {
      await updateTask(task.id, { notified: true });
    });

    if (tasksToNotify.length > 0) {
      loadTasks();
    }
  };

  const handleAddTask = async (task) => {
    await addTask(task);
    await loadTasks();
    setShowForm(false);
  };

  const handleToggleTask = async (id) => {
    await toggleTaskComplete(id);
    await loadTasks();
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await deleteTask(id);
      await loadTasks();
    }
  };

  const handleEditTask = async (id, updates) => {
    await updateTask(id, updates);
    await loadTasks();
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'urgent-important':
        return tasks.filter((t) => t.urgent && t.important && !t.completed);
      case 'important':
        return tasks.filter((t) => !t.urgent && t.important && !t.completed);
      case 'urgent':
        return tasks.filter((t) => t.urgent && !t.important && !t.completed);
      case 'later':
        return tasks.filter((t) => !t.urgent && !t.important && !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  };

  const getCategoryTasks = (urgent, important) => {
    return tasks.filter(
      (t) => t.urgent === urgent && t.important === important && !t.completed
    );
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo</h1>
        <p className="app-subtitle">
          C'est quoi que j'ai à faire !
        </p>
      </header>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          className={`filter-btn ${
            filter === 'urgent-important' ? 'active' : ''
          }`}
          onClick={() => setFilter('urgent-important')}
        >
          Urgent & Important ({getCategoryTasks(true, true).length})
        </button>
        <button
          className={`filter-btn ${filter === 'important' ? 'active' : ''}`}
          onClick={() => setFilter('important')}
        >
          Important ({getCategoryTasks(false, true).length})
        </button>
        <button
          className={`filter-btn ${filter === 'urgent' ? 'active' : ''}`}
          onClick={() => setFilter('urgent')}
        >
          Urgent ({getCategoryTasks(true, false).length})
        </button>
        <button
          className={`filter-btn ${filter === 'later' ? 'active' : ''}`}
          onClick={() => setFilter('later')}
        >
          À planifier ({getCategoryTasks(false, false).length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Terminées ({tasks.filter((t) => t.completed).length})
        </button>
      </div>

      <main className="app-main">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>Aucune tâche pour le moment</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              Créer votre première tâche
            </button>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </main>

      <button
        className="fab"
        onClick={() => setShowForm(true)}
        title="Ajouter une tâche"
      >
        <span>+</span>
      </button>

      {showForm && (
        <TaskForm onAdd={handleAddTask} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default App;
