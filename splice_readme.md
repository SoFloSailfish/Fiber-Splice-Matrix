# Fiber Splice Matrix

A fiber optic splice documentation and diagram tool built for **Lee County Innovation & Technology (ITG)**. Document splice closures, map fiber-to-fiber fusion splices with correct TIA-598 color coding, and generate clean, printable splice diagrams for handhole and enclosure records.

Runs entirely in the browser — no server, no install required — and works **offline in the field** once loaded.

**Live app:** https://soflosailfish.github.io/Fiber-Splice-Matrix

---

## Features

- **Cable & buffer tube layout** — up to 6 cables, sizes from 12F to 288F, each assigned a direction (North / South / East / West).
- **Fiber-to-fiber splicing** — click a source fiber, then a destination, to record a fusion splice. Select a range on one cable to splice a whole block of fibers at once.
- **TIA-598 color coding** — standard 12-color fiber and buffer tube scheme throughout, with contrast outlines so every strand stays legible on screen and in print.
- **Splice diagram** — auto-generated drawing sheet with color-coded splice paths (right-angle routing for easy strand-following), a title block, TIA-598 legend, direction key, and the ITG logo. Sized for printing on 11×14.
- **Splice schedule** — a full fusion splice table, exportable to Excel (CSV).
- **PNG export** — the diagram exports as a high-resolution PNG on a clean white sheet, ready to print or drop into documentation.
- **Dark mode** — on by default for screen comfort; the printed/exported diagram always stays light.
- **Auto-save** — work is saved to the browser automatically, so a refresh never loses data.
- **Project files** — save a project as a `.json` file (one per enclosure) and re-open it later or on another machine.
- **Works offline** — installable as a PWA; after the first load it runs with no internet connection.

---

## Using it in the field

Because it's a Progressive Web App, you can install it to a phone, tablet, or laptop and use it with **no connection** — handy for quick drawings on site or splice-can audits.

**To install:**

- **Desktop (Chrome / Edge):** open the live app, then click the install icon in the address bar (or menu → *Install Fiber Splice Matrix*).
- **iPhone / iPad (Safari):** open the live app → Share → *Add to Home Screen*.
- **Android (Chrome):** open the live app → menu → *Add to Home screen / Install app*.

Load the app once while you have signal. After that it opens and runs offline. Your data stays on the device, and you can export a `.json` or PNG when you're back in range.

---

## Running / hosting

### GitHub Pages (recommended)

1. Create a repository named **`Fiber-Splice-Matrix`**.
2. Add these four files to the repo root:
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `README.md`
3. Go to **Settings → Pages**, set **Source** to your main branch (root), and save.
4. The app publishes at `https://<username>.github.io/Fiber-Splice-Matrix`.

> All four files must sit in the same folder — the service worker and manifest are referenced by relative path.

### Locally

For full offline/PWA behavior the files should be served over `http(s)` rather than opened directly from disk (service workers don't register on `file://`). Any static server works, e.g.:

```
python -m http.server 8000
```

then open `http://localhost:8000`. Opening `index.html` directly still runs the app — you just won't get the offline service worker until it's served over http.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire application (UI, diagram engine, exports). |
| `sw.js` | Service worker — caches the app and libraries for offline use. |
| `manifest.webmanifest` | PWA manifest — name, icon, colors, install behavior. |
| `README.md` | This file. |

---

## Notes

- Built with React (loaded from CDN) and rendered in-browser — no build step.
- After the first load, the service worker caches the React/Babel libraries, so subsequent launches work without internet.
- To push an update, edit the files and bump `CACHE_VERSION` in `sw.js` so clients pick up the new version.
- All project data is stored locally in the browser and in the `.json` files you save. Nothing is sent anywhere.

---

*Lee County Innovation & Technology*
