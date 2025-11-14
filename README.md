# Todo - Application de Pense-Bête PWA

Une application Progressive Web App (PWA) de gestion de tâches utilisant la matrice Eisenhower pour prioriser vos actions.

## Fonctionnalités

- **Ajout rapide de tâches** : Interface intuitive pour créer rapidement des pense-bêtes
- **Matrice Eisenhower** : Classez vos tâches selon leur urgence et importance
  - Urgent & Important
  - Important (non urgent)
  - Urgent (non important)
  - À planifier
- **Rappels avec notifications** : Configurez des rappels pour ne rien oublier
- **Mode hors-ligne** : Fonctionne même sans connexion internet grâce au PWA
- **Stockage local** : Toutes vos données restent sur votre appareil (IndexedDB)
- **Mobile-first** : Interface optimisée pour les appareils mobiles

## Technologies utilisées

- **React** : Framework UI
- **Vite** : Bundler et dev server
- **IndexedDB** : Stockage local des données (via idb)
- **Workbox** : Service worker pour le mode PWA
- **GitHub Pages** : Hébergement

## Installation et développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## Déploiement sur GitHub Pages

L'application est configurée pour se déployer automatiquement sur GitHub Pages via GitHub Actions.

### Étapes :

1. Créez un repository GitHub pour ce projet
2. Dans les paramètres du repository (Settings > Pages), configurez :
   - Source : GitHub Actions
3. Poussez votre code sur la branche `main`
4. Le workflow se déclenchera automatiquement et déploiera l'application

L'application sera accessible à l'adresse : `https://[votre-username].github.io/todo/`

## Utilisation

1. **Ajouter une tâche** : Cliquez sur le bouton `+` en bas à droite
2. **Classifier** : Sélectionnez le niveau d'urgence et d'importance
3. **Ajouter un rappel** : Choisissez une date et heure pour être notifié
4. **Filtrer** : Utilisez les boutons en haut pour filtrer par catégorie
5. **Compléter** : Cochez la case pour marquer une tâche comme terminée
6. **Modifier/Supprimer** : Utilisez les boutons sur chaque tâche

## PWA - Installation sur mobile

L'application peut être installée sur votre appareil mobile :

- **iOS** : Ouvrez dans Safari > Partager > Ajouter à l'écran d'accueil
- **Android** : Ouvrez dans Chrome > Menu > Installer l'application

## Structure du projet

```
todo/
├── src/
│   ├── components/        # Composants React
│   │   ├── TaskForm.jsx   # Formulaire d'ajout de tâche
│   │   └── TaskItem.jsx   # Affichage d'une tâche
│   ├── services/          # Services métier
│   │   ├── db.js          # Gestion IndexedDB
│   │   └── notifications.js # Gestion des notifications
│   ├── App.jsx            # Composant principal
│   └── index.css          # Styles globaux
├── public/                # Fichiers statiques
└── .github/workflows/     # CI/CD GitHub Actions
```

## Permissions

L'application demande les permissions suivantes :

- **Notifications** : Pour vous rappeler vos tâches à faire

## Licence

MIT
