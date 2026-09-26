# RecipeVault AI — VS Code Step-by-Step

## 1. Install Node.js

Open Terminal and check:

```bash
node -v
npm -v
```

QVAC's current JS/TS documentation requires Node.js 22.17+ and npm 10.9+.

If your Node version is older, update Node.js before continuing.

## 2. Open the project in VS Code

1. Open VS Code.
2. Select **File → Open Folder**.
3. Choose `RecipeVault-Web-QVAC`.
4. Open **Terminal → New Terminal**.

## 3. Install dependencies

Run:

```bash
npm install
```

This installs Express and QVAC SDK 0.20.0.

## 4. Start the website

Run:

```bash
npm start
```

You should see:

```text
RecipeVault AI running at http://localhost:3000
AI inference: QVAC local embeddings
```

Open:

```text
http://localhost:3000
```

## 5. Run your first QVAC search

Try:

```text
spicy potato dish without cheese
```

Click **Find recipes**.

On the first search QVAC may download the embedding model. Wait for the download to finish.

The result should show recipe cards and match percentages.

## 6. Test more searches

Try:

```text
quick vegetarian breakfast
```

```text
creamy pasta for dinner
```

```text
healthy chicken meal
```

```text
sweet dessert with fruit
```

## 7. Understand the QVAC code

Open `server.js`.

The important import is:

```js
import {
  embed,
  GTE_LARGE_FP16,
  loadModel,
  unloadModel
} from "@qvac/sdk";
```

Model loading:

```js
modelId = await loadModel({
  modelSrc: GTE_LARGE_FP16
});
```

Recipe embedding:

```js
const result = await embed({
  modelId: id,
  text: texts
});
```

Search-query embedding:

```js
const queryResult = await embed({
  modelId: id,
  text: query
});
```

The app then compares the vectors using cosine similarity.

## 8. Make your first commit

In VS Code Terminal:

```bash
git init
git branch -M main
git add .
git commit -m "feat: create RecipeVault QVAC web app"
```

## 9. Make the second commit

Make a small improvement, such as changing a recipe, title, or UI text.

Then:

```bash
git add .
git commit -m "feat: add local semantic recipe search"
```

## 10. Make the third commit

Update the README if needed:

```bash
git add README.md
git commit -m "docs: document QVAC architecture and setup"
```

Check:

```bash
git log --oneline --decorate -3
```

You should have at least 3 commits.

## 11. Create GitHub repository

On GitHub:

1. Create a new repository named `RecipeVault-Web-QVAC`.
2. Make it **Public**.
3. Do not add another README if your local project already has one.
4. Create the repository.

GitHub will show commands for connecting the local repository.

Typical commands are:

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPO_URL` with your actual repository URL.

## 12. Verify GitHub

Open your repository and check that these are visible:

```text
README.md
LICENSE
package.json
server.js
public/
```

## 13. Capture the required screenshot

Open the working website.

Use a search such as:

```text
spicy potato dish without cheese
```

Make sure the screenshot shows:

- RecipeVault AI
- the search query
- recipe results
- match percentages
- `LOCAL QVAC`

This proves the app is working.

## 14. Make the X post

Your post should include:

- what RecipeVault AI does
- that it uses QVAC locally
- your GitHub repository link
- `@qvac`

Example:

> Built RecipeVault AI 🍳 — a local semantic recipe search app powered by Tether's QVAC SDK. Search recipes by meaning with on-device embeddings, without a cloud AI API.  
>  
> GitHub: YOUR_REPO_URL  
> @qvac

## 15. Final submission

Submit:

```text
GitHub repo URL:
https://github.com/YOUR_USERNAME/RecipeVault-Web-QVAC

X post URL:
https://x.com/YOUR_USERNAME/status/YOUR_POST_ID
```

Also provide the screenshot/recording and the short description:

> RecipeVault AI is a local semantic recipe discovery app. It uses QVAC `loadModel()` and `embed()` to create embeddings locally and rank recipes by cosine similarity.
