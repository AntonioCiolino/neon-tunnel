# Neon Tunnel

A wireframe tunnel shooter in the style of the Matrix: you fly forward through a twisting green tunnel, tap the shapes coming at you to blast them into triangle fragments, and survive as long as you can.

**Play it:** https://antoniociolino.github.io/neon-tunnel/ (tap or click to shoot; works on phones).

## Built by voice

Every line of this game was written by [Voice Developer](https://github.com/AntonioCiolino/voice-developer), a phone-controlled app builder. Spoken requests go to a planner model, which breaks each one into small tasks, and a coder model (Aider) carries out one task at a time, with a build and lint check after each.

It started from this request:

> Create a matrix like 3-D shooter game where you are going forward into a 3-D space tunnel it's more wire frame than anything else and as you go forward into this tunnel that twists and turns objects are in the path you have to tap them to destroy them they explode into a shower of fragments triangles. Keep it matrix C and then you get points. If you get hit by three of them the game is over.

Later requests added sound, health, ammo, enemy types, levels and tuning.

The history is the build log. The first commit is the blank app Voice Developer starts from, and each commit after it is one task, named `Task i/n: <what it did> [files: ...]`, in the order it ran. One commit, `Fix the white screen after Start`, was made by hand: the first version left a component guessing what a hook returned, which is how Voice Developer learned to show each task the files earlier tasks wrote (its last line refers to files from the app this one replaced, which are not in this repo). The final commit adds this README and the GitHub Pages deploy.

## Run it locally

```
npm install
npm run dev
```

React 18, Vite 5 and three.js. Tailwind CSS is loaded from its CDN in `index.html`. Sounds are synthesized with the Web Audio API, so there are no asset files. On an iPhone, sound needs the ring/silent switch set to ring.

## Change it by voice

Clone this repo into Voice Developer's `saved-apps/neon-tunnel/`, then choose **Load App**. The game becomes the current app, and new requests change it.
