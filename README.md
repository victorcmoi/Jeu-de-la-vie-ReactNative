# Jeu de la Vie — React Native

Application mobile du célèbre « Game of Life » de Conway, réalisée avec React Native et Expo.

## Sommaire

- [Aperçu](#aperçu)
- [Installation](#installation)
- [Lancer en développement](#lancer-en-développement)
- [Fonctionnalités](#fonctionnalités)
- [Build APK avec EAS](#build-apk-avec-eas)
- [Structure du projet](#structure-du-projet)

## Aperçu

L'application présente une grille interactive du Jeu de la Vie avec des contrôles pour démarrer, mettre en pause et réinitialiser la simulation.

## Installation

Vous aurez besoin de [Node.js](https://nodejs.org/) (version récente) et de l'outil `eas-cli` d'Expo.

1.  **Installez EAS CLI :**
    ```bash
    npm install -g eas-cli
    ```

2.  **Clonez le dépôt et installez les dépendances :**
    ```bash
    git clone https://github.com/VigasDev/Jeu-de-la-vie-ReactNative.git
    cd Jeu-de-la-vie-ReactNative
    npm install
    ```

## Lancer en développement

Pour démarrer le serveur de développement Expo, exécutez :

```bash
npm start
```

Depuis le terminal, vous pouvez utiliser les raccourcis suivants :
- `a` → ouvrir sur un émulateur Android
- `i` → ouvrir sur un simulateur iOS (macOS uniquement)
- `w` → ouvrir dans un navigateur web

## Fonctionnalités

- **Lecture/Pause :** Démarre ou arrête la simulation automatique des générations.
- **Prochaine génération :** Avance la simulation d'une seule étape.
- **Réinitialiser :** Vide complètement la grille.
- **Grille interactive :** Touchez une cellule pour changer son état (vivante/morte) lorsque la simulation est en pause.
- **Topologie torique :** Les bords de la grille sont connectés, une cellule sortant d'un côté réapparaît de l'autre.

## Build APK avec EAS

Le fichier `eas.json` est configuré pour créer des builds pour le développement, la prévisualisation et la production.

- **Build de développement :**
  ```bash
  eas build --platform android --profile development
  ```
- **Build de prévisualisation (APK) :**
  ```bash
  eas build --platform android --profile preview
  ```
- **Build de production (AAB) :**
  ```bash
  eas build --platform android --profile production
  ```

Pour utiliser EAS, vous devrez peut-être vous connecter à votre compte Expo et configurer le projet :
```bash
eas login
eas build:configure
```

## Structure du projet

```
.
├── app/              # Écrans et routing (Expo Router)
│   └── index.tsx     # Écran principal du jeu
├── components/       # Composants React réutilisables
│   └── game/
│       ├── Controls.tsx # Boutons de contrôle (Play, Next, Reset)
│       └── Grid.tsx     # Grille du jeu
├── utils/            # Logique et fonctions utilitaires
│   └── gameLogic.ts  # Fonctions principales du Jeu de la Vie
├── types/            # Définitions TypeScript
│   └── game.ts       # Types pour la grille
├── eas.json          # Configuration des builds EAS
└── package.json      # Dépendances et scripts NPM
```
