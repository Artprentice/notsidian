# NotSidian

> I got lost in Obsidian. So I built my own.

---

Obsidian is incredible. It's also a rabbit hole.

I spent more time installing plugins, tweaking themes, and configuring hotkeys than I ever spent actually writing. Sound familiar?

NotSidian is my answer to that. A notes app so simple there's nothing to configure. You open it, you see a cursor, and you write. That's it.

---

## What it does

- **Markdown notes** — write freely, save automatically
- **Sidebar** — all your notes, one click away
- **First line is the title** — no "name your file" prompts
- **Saves as .md** — your notes are just files, not locked in a database
- **5 built-in themes** — Light, Dark, Gruvbox, Nord, Rosé Pine
- **Custom themes** — build your own palette, name it, save it
- **Works on mobile** — responsive, touch-friendly
- **Zero setup** — download, open in browser, start writing

---

## What it deliberately doesn't do

No plugins. No graph view. No sync setup wizard. No community marketplace. No configuration files. No account required.

The complexity is the product over there. The simplicity is the product here.

---

## This is a build-in-public project

I'm a self-taught developer building this from scratch and documenting every step. The MVP you're looking at right now is plain HTML, CSS, and JavaScript — no frameworks, no dependencies, just a browser and a text editor.

**Where it's going:**

- [ ] React rebuild — same app, proper component architecture
- [ ] Note linking — `[[wikilinks]]` between your notes
- [ ] Fast search
- [ ] Desktop app via Tauri
- [ ] Mobile app via Capacitor or react native
- [ ] Sync across devices *(paid)*
- [ ] Publish notes as a website *(paid)*

I'm building this in the open because I think the journey matters as much as the destination. If you've ever wanted to watch something go from a blank HTML file to a real product — follow along.

---

## Run it locally

No install. No build step. This is just an mvp

```bash
git clone https://github.com/Artprentice/notsidian
cd notsidian
```

Open `index.html` with a live server (VS Code Live Server extension works great) and you're done.

feel free to improve on it, rebrand and host it.

---

## Tech stack

| Now | Later |
|---|---|
| HTML + CSS + JS | React |
| localStorage | SQLite |
| Browser only | Tauri (desktop) + Capacitor (mobile)/ React Native |

---

## Follow the build

This project is being built and documented publicly. Every decision, every mistake, every refactor — out in the open.

Built by [\[https://x.com/ManuJr_dev\]](https://x.com/ManuJr_dev) **[@ManuJr_dev](#)** — a developer learning in public, one project at a time.

---

*NotSidian is free and open source. MIT License.*
