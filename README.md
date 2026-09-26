# RecipeVault AI — QVAC

RecipeVault AI is a local-first recipe discovery website. Type a natural-language craving such as **"spicy potato dish without cheese"**, and the app ranks recipes by semantic similarity.

## QVAC requirement

This project uses:

- `@qvac/sdk` **0.20.0**
- `loadModel()`
- `embed()`
- `unloadModel()`

The embedding model is loaded and run by QVAC on the same machine running the app. Recipe text and the search query are sent to the local Node.js process only; there is no cloud AI API in this application.

QVAC's embedding API returns vectors for single text or batches of text, which are compared here with cosine similarity.

## Architecture

```text
Browser UI
   ↓
Local Express server
   ↓
QVAC loadModel()
   ↓
QVAC embed()
   ↓
Cosine similarity
   ↓
Ranked local recipes
```

## Requirements

- Node.js 22.17.0 or newer
- npm 10.9 or newer
- macOS, Windows, or Linux supported by QVAC
- Internet connection for the first model download; later runs use the downloaded model cache

## Install

```bash
npm install
```

## Run

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

On first search, QVAC downloads the embedding model. This can take time and requires disk space.

## Try these searches

- `spicy potato dish without cheese`
- `quick vegetarian breakfast`
- `creamy pasta for dinner`
- `healthy chicken meal`
- `sweet dessert with fruit`

## Project structure

```text
RecipeVault-Web-QVAC/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── server.js
├── package.json
├── LICENSE
└── README.md
```

## Submission checklist

- [ ] App runs locally
- [ ] QVAC is declared in `package.json`
- [ ] `loadModel()` and `embed()` are present
- [ ] README includes install/run instructions and SDK version
- [ ] Public GitHub repository
- [ ] Open-source license
- [ ] At least 3 commits authored by you
- [ ] Screenshot or screen recording with AI output visible
- [ ] X post links the repo and tags `@qvac`

## Suggested commit history

```text
feat: create RecipeVault QVAC web app
feat: add local semantic recipe search
docs: document QVAC architecture and setup
```
