export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Ce navigateur ne supporte pas les notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    persistentNotification(title, options);
    //return new Notification(title, {
    //icon: '/pwa-192x192.png',
    //  badge: '/pwa-192x192.png',
    //  ...options,
    //});
  }
};

function nonPersistentNotification(title, options = {}) {
  return new Notification(title, {
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    ...options,
  });
}

function persistentNotification(title, options = {}) {
  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    console.log('Persistent Notification API not supported!');
    return;
  }

  try {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => {
        console.log('showing persistent notification');
        reg.showNotification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options,
        });
      })
      .catch((err) =>
        console.error('Service Worker registration error: ' + err)
      );
  } catch (err) {
    console.error('Notification API error: ' + err);
  }
}

export const checkReminders = async (tasks) => {
  const now = Date.now();
  const tasksToNotify = tasks.filter(
    (task) =>
      task.reminderDate &&
      task.reminderDate <= now &&
      !task.completed &&
      !task.notified
  );

  return tasksToNotify;
};

export const scheduleNotification = (task) => {
  if (!task.reminderDate) return null;

  const now = Date.now();
  const delay = task.reminderDate - now;

  if (delay <= 0) {
    sendNotification('Rappel: ' + task.title, {
      body: task.description || 'Vous avez une tâche à faire',
      tag: `task-${task.id}`,
      requireInteraction: true,
    });
    return null;
  }

  return setTimeout(() => {
    sendNotification('Rappel: ' + task.title, {
      body: task.description || 'Vous avez une tâche à faire',
      tag: `task-${task.id}`,
      requireInteraction: true,
    });
  }, delay);
};
