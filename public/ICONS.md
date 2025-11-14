# Génération des icônes PWA

Le fichier `icon.svg` contient l'icône de base de l'application. Vous devez générer les icônes PNG requises pour la PWA.

## Tailles requises

- `pwa-192x192.png` : 192x192 pixels
- `pwa-512x512.png` : 512x512 pixels
- `favicon.ico` : 16x16, 32x32, 48x48 pixels (optionnel)
- `apple-touch-icon.png` : 180x180 pixels (optionnel)

## Méthodes de génération

### Option 1 : Avec ImageMagick (ligne de commande)

```bash
# Installer ImageMagick si nécessaire
brew install imagemagick  # macOS
sudo apt-get install imagemagick  # Ubuntu/Debian

# Générer les icônes
convert icon.svg -resize 192x192 pwa-192x192.png
convert icon.svg -resize 512x512 pwa-512x512.png
convert icon.svg -resize 180x180 apple-touch-icon.png
```

### Option 2 : Avec un outil en ligne

1. Visitez [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Uploadez `icon.svg`
3. Téléchargez les icônes générées
4. Placez-les dans le dossier `public/`

### Option 3 : Avec un éditeur graphique

- **GIMP** (gratuit) : Ouvrez le SVG et exportez aux bonnes tailles
- **Figma** (gratuit en ligne) : Importez le SVG et exportez en PNG
- **Photoshop** : Importez le SVG et exportez aux tailles requises

## Notes

Les icônes PNG doivent être placées dans le dossier `public/` pour être accessibles par la PWA.
