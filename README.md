# PILLAR PENE — Pillar Chase Event

Static responsive event website designed for GitHub Pages.

## Structure

- `index.html` — landing page / event overview
- `event.html` — how the event works and scoring
- `leaderboard.html` — leaderboard
- `css/styles.css` — all site styling and responsive layout
- `js/data.js` — editable event + sample leaderboard data
- `js/app.js` — shared site behavior, scroll animations and follower progress
- `js/leaderboard.js` — leaderboard rendering, search and filters
- `images/` — put the final event artwork/screenshots here

## Local preview

Because the site is static, you can run it with any local HTTP server. For example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

Opening the HTML files directly also works for the basic layout, but an HTTP server is recommended for testing exactly as GitHub Pages will serve it.

## GitHub Pages deployment

1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your main branch and the **`/ (root)`** folder.
6. Save. GitHub will publish the site at the generated Pages URL.

The project does not require Node.js, npm, a build step or a framework.

## Event configuration

Edit `js/data.js` to change the event name, date, follower count, goal, prize, host and scoring values.

For example:

```js
currentFollowers: 347,
followerGoal: 500,
monsterPoints: 10,
survivorPoints: 5,
```

## Images

Put final images in `images/` and replace the placeholder blocks in the HTML with relative paths such as:

```html
<img src="images/event-banner.webp" alt="Pillar Chase event banner">
```

For GitHub Pages, keep filenames and paths case-sensitive and use relative URLs rather than local computer paths.

## Leaderboard

The current leaderboard uses `window.PLAYERS` in `js/data.js` as sample data. Replace that array or connect `js/leaderboard.js` to the leaderboard source you already have prepared.
