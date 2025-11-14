// Service de parsing intelligent pour extraire les informations d'une phrase

const URGENT_KEYWORDS = [
  'urgent',
  'urgente',
  'immédiatement',
  'tout de suite',
  'maintenant',
  'rapidement',
  'vite',
  'au plus vite',
  'dès que possible',
  'asap',
  'urgemment',
  'urgence',
  'en urgence',
  'en priorité',
];

const IMPORTANT_KEYWORDS = [
  'important',
  'importante',
  'crucial',
  'cruciale',
  'prioritaire',
  'essentiel',
  'essentielle',
  'capital',
  'capitale',
  'primordial',
];

const TIME_PATTERNS = {
  // Heures
  hour: /(\d{1,2})h(\d{2})?/gi,
  hourAlt: /à\s+(\d{1,2})\s*heures?\s*(\d{2})?/gi,

  // Jours relatifs
  today: /aujourd'hui/gi,
  tomorrow: /demain/gi,
  dayAfterTomorrow: /après[- ]demain/gi,

  // Délais relatifs
  inMinutes: /dans\s+(\d+)\s+minutes?/gi,
  inHours: /dans\s+(\d+)\s+heures?/gi,
  inDays: /dans\s+(\d+)\s+jours?/gi,

  // Jours de la semaine
  weekdays:
    /(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*(prochain|suivant)?/gi,

  // Dates absolues
  dateFormat: /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/g,
  dateVerbal:
    /(?:pour\s+)?le\s+(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(?:\s+(\d{4}))?/gi,
};

const WEEKDAYS = {
  lundi: 1,
  mardi: 2,
  mercredi: 3,
  jeudi: 4,
  vendredi: 5,
  samedi: 6,
  dimanche: 0,
};

const MONTHS = {
  janvier: 0,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
};

// Extraire le titre en supprimant les mots-clés de contexte
function extractTitle(text) {
  let title = text;

  // Supprimer les préfixes courants
  title = title.replace(
    /^(rappelle[- ]moi|rappel|note|pense[- ]bête|ajoute|crée|nouvelle tâche)\s+(de|d'|à|pour)?\s*/gi,
    ''
  );

  // Supprimer les indicateurs temporels à la fin
  title = title.replace(/\s+(aujourd'hui|demain|après[- ]demain).*$/gi, '');
  title = title.replace(/\s+dans\s+\d+\s+(minutes?|heures?|jours?).*$/gi, '');
  title = title.replace(/\s+à\s+\d{1,2}h?\d{0,2}.*$/gi, '');
  title = title.replace(
    /\s+(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche).*$/gi,
    ''
  );
  title = title.replace(
    /\s+(?:pour\s+)?le\s+\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)(?:\s+\d{4})?.*$/gi,
    ''
  );

  // Supprimer les mots-clés d'urgence/importance
  title = title.replace(
    /\s*,?\s*(c'est|très)?\s*(urgent|important|crucial|prioritaire)e?/gi,
    ''
  );
  title = title.replace(/\s*et\s*(urgent|important)e?\s*$/gi, '');

  // Nettoyer
  title = title.trim();

  // Capitaliser la première lettre
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return title || 'Nouvelle tâche';
}

// Détecter si la tâche est urgente
function isUrgent(text) {
  const lowerText = text.toLowerCase();
  return URGENT_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

// Détecter si la tâche est importante
function isImportant(text) {
  const lowerText = text.toLowerCase();
  return IMPORTANT_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

// Extraire la date/heure
function extractDateTime(text) {
  const now = new Date();
  let targetDate = null;
  let hour = null;
  let minute = 0;

  // Chercher une heure spécifique
  let hourMatch = TIME_PATTERNS.hour.exec(text);
  if (!hourMatch) {
    hourMatch = TIME_PATTERNS.hourAlt.exec(text);
  }

  if (hourMatch) {
    hour = parseInt(hourMatch[1]);
    minute = hourMatch[2] ? parseInt(hourMatch[2]) : 0;
  }

  // Aujourd'hui
  if (TIME_PATTERNS.today.test(text)) {
    targetDate = new Date(now);
  }

  // Demain
  else if (TIME_PATTERNS.tomorrow.test(text)) {
    targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Après-demain
  else if (TIME_PATTERNS.dayAfterTomorrow.test(text)) {
    targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + 2);
  }

  // Dans X minutes
  else {
    const minutesMatch = TIME_PATTERNS.inMinutes.exec(text);
    if (minutesMatch) {
      targetDate = new Date(now);
      targetDate.setMinutes(
        targetDate.getMinutes() + parseInt(minutesMatch[1])
      );
      return targetDate.getTime();
    }
  }

  // Dans X heures
  if (!targetDate) {
    const hoursMatch = TIME_PATTERNS.inHours.exec(text);
    if (hoursMatch) {
      targetDate = new Date(now);
      targetDate.setHours(targetDate.getHours() + parseInt(hoursMatch[1]));
      return targetDate.getTime();
    }
  }

  // Dans X jours
  if (!targetDate) {
    const daysMatch = TIME_PATTERNS.inDays.exec(text);
    if (daysMatch) {
      targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + parseInt(daysMatch[1]));
    }
  }

  // Jour de la semaine
  if (!targetDate) {
    const weekdayMatch = TIME_PATTERNS.weekdays.exec(text);
    if (weekdayMatch) {
      const dayName = weekdayMatch[1].toLowerCase();
      const isNext = weekdayMatch[2] !== undefined;
      const targetDay = WEEKDAYS[dayName];
      const currentDay = now.getDay();

      targetDate = new Date(now);
      let daysToAdd = targetDay - currentDay;

      if (daysToAdd <= 0 || isNext) {
        daysToAdd += 7;
      }

      targetDate.setDate(targetDate.getDate() + daysToAdd);
    }
  }

  // Date verbale (ex: "le 3 janvier 2026" ou "pour le 15 mars")
  if (!targetDate) {
    const verbalMatch = TIME_PATTERNS.dateVerbal.exec(text);
    if (verbalMatch) {
      const day = parseInt(verbalMatch[1]);
      const monthName = verbalMatch[2].toLowerCase();
      const year = verbalMatch[3]
        ? parseInt(verbalMatch[3])
        : now.getFullYear();
      const month = MONTHS[monthName];

      if (month !== undefined) {
        targetDate = new Date(year, month, day);

        // Si la date est dans le passé et qu'aucune année n'est spécifiée, passer à l'année prochaine
        if (!verbalMatch[3] && targetDate < now) {
          targetDate.setFullYear(now.getFullYear() + 1);
        }
      }
    }
  }

  // Si on a trouvé une date
  if (targetDate) {
    if (hour !== null) {
      targetDate.setHours(hour, minute, 0, 0);
    } else {
      // Par défaut, mettre à 9h si pas d'heure spécifiée
      targetDate.setHours(9, 0, 0, 0);
    }

    return targetDate.getTime();
  }

  return null;
}

// Parser la phrase complète
export function parseTaskFromSpeech(transcript) {
  return {
    title: extractTitle(transcript),
    urgent: isUrgent(transcript),
    important: isImportant(transcript),
    reminderDate: extractDateTime(transcript),
    originalTranscript: transcript,
  };
}
