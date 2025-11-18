# Jeu de la Vie — React Nativ

Application mobile du célèbre « Game of Life » de Conway, réalisée avec React Native.

- Grille de taille variable (8×8 → 52×52)
- Sauvegardes multiples en JSON, écran de liste avec chargement/renommage/suppression
- Motifs (patterns) connus: glider, pulsar, blinker, toad, beacon, block, beehive, loaf, boat, lwss, gosperGun
- Placement libre des motifs (taper n’importe où sur la grille)
- Variante Debug avec annulation (Undo) jusqu’à 10 étapes (activée au build par variable d’environnement)

---

## Sommaire
- [Aperçu](#aperçu)
- [Installation](#installation)
- [Lancer en développement](#lancer-en-développement)
- [Fonctionnalités](#fonctionnalités)
- [Sauvegardes et écran "Saved"](#sauvegardes-et-écran-saved)
- [Motifs (patterns)](#motifs-patterns)
- [Variante Debug Undo](#variante-debug-undo)
- [Build APK avec EAS](#build-apk-avec-eas)
- [Configuration (.env)](#configuration-env)
- [Structure du projet](#structure-du-projet)

---

## Aperçu
- Onglet Game: grille interactive, contrôles Lecture/Taille/Sauvegardes/Motifs.
- Onglet Saved: liste des grilles sauvegardées avec actions (Charger, Renommer, Supprimer).

## Installation

```bash
# Cloner le dépôt puis installer les dépendances
npm install
```

Vous aurez besoin de Node.js récent et de l’outil Expo:
```bash
npm i -g expo-cli eas-cli
# ou seulement EAS si vous ne souhaitez pas utiliser l’ancien expo-cli
npm i -g eas-cli
```

## Lancer en développement

```bash
# Démarrer le serveur Expo
npm start
# Raccourcis utiles:
#   a → ouvrir sur l’émulateur Android
#   i → ouvrir sur le simulateur iOS (macOS)
#   w → ouvrir sur le web
```

Si vous utilisez la variante Debug Undo en local, créez/éditez un fichier `.env` (voir [Configuration (.env)](#configuration-env)) et redémarrez avec cache vidé:
```bash
expo start -c
```

## Fonctionnalités
- Lecture/Pause + étape suivante (Prochain)
- Réinitialiser la grille à la taille courante
- Contrôle de la taille (8 à 52)
- Sauvegarder la grille en JSON, avec nom généré (date/heure)
- Accéder à la liste des sauvegardes (onglet "Saved")
- Ajouter des motifs prédéfinis, au centre ou en placement libre (sélection du motif puis tap sur la grille)
- Variante Debug: bouton "Annuler" pour revenir jusqu’à 10 étapes en arrière (si activée au build)

## Sauvegardes 
- Stockage via `AsyncStorage` sous la clé `gol:saves`
- Chaque entrée: `{ id, name, grid, size, timestamp }`
- Écran Saved (`app/saved/index.tsx`) permet:
    - Charger (renvoie à l’onglet Game et applique la sauvegarde)
    - Renommer
    - Supprimer
    - Pull-to-refresh

## Motif
- Disponibles: `glider`, `pulsar`, `blinker`, `toad`, `beacon`, `block`, `beehive`, `loaf`, `boat`, `lwss`, `gosperGun`
- Placement libre: choisissez un motif (chips) puis touchez la cellule souhaitée; bouton "Terminer" pour quitter le mode placement.
- Les placements utilisent une topologie torique (rebouclent sur les bords).

## Variante Debug
- Contrôlée par la variable d’environnement publique `EXPO_PUBLIC_DEBUG_UNDO` (intégrée au build Expo)
- Quand `true`:
    - Le bouton "Annuler" apparaît (section Lecture)
    - L’app prend des snapshots avant les actions (toggle cellule, placement motif, next, tick auto) — jusqu’à 10
- Quand `false`:
    - Aucune UI d’Undo. L’historique est inactif.

## Build APK avec EAS
Le fichier `eas.json` fournit deux profils prêt-à-l’emploi:

- Standard (V2):
  ```bash
  eas build --platform android --profile preview-standard
  ```
- Debug Undo (avec Undo 10 étapes):
  ```bash
  eas build --platform android --profile preview-debug-undo
  ```

Détails:
- Les deux profils sortent un APK (`android.buildType = apk`) pratique pour installation directe.
- Le profil `production` génère un AAB (Play Store).
- Suivre les builds: l’URL s’affiche en fin de commande, ou via l’interface Expo.

Prérequis EAS (une seule fois):
```bash
# Se connecter et configurer le projet
eas login
eas build:configure
```

## Configuration (.env)
Le projet lit `EXPO_PUBLIC_DEBUG_UNDO` via `utils/config.ts`.

- Exemple (`.env.example`):
  ```
  EXPO_PUBLIC_DEBUG_UNDO=false
  ```
- En développement local, éditez `.env` puis relancez Expo avec `expo start -c`.
- En build cloud, les profils de `eas.json` définissent déjà la variable (inutile de modifier `.env`).

## Structure du projet
- `app/` — écrans avec Expo Router (onglets: `index` = Game, `saved` = liste des sauvegardes)
- `components/` — UI du jeu (`Grid`, `Cell`, `Controls`)
- `utils/` — logique du jeu (`gameLogic.ts`), motifs (`patterns.ts`), stockage (`storage.ts`), config env (`config.ts`)
- `types/` — types TypeScript partagés
- `eas.json` — profils de build EAS