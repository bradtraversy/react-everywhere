# react-everywhere

One React hook. Every renderer. Zero edits to the logic.

`packages/logic/useTimer.js` is a 60 second countdown written in plain JavaScript. It imports `useState`-era React and nothing else - no DOM, no browser, no host assumptions. Every app in this repo imports that exact file, unchanged, and renders it somewhere different.

The rule for this repo: **if a renderer requires editing `useTimer.js`, the renderer is wrong, not the hook.**

## Renderers

| # | Target | Renderer | Status |
|---|--------|----------|--------|
| 1 | Web | `react-dom` | done |
| 2 | Desktop | Electron | done |
| 3 | Mobile | React Native (Expo) | done |
| 4 | Terminal | Ink | done |
| 5 | 3D | React Three Fiber | todo |
| 6 | Video | Remotion | todo |
| 7 | PDF | `@react-pdf/renderer` | todo |
| 8 | XR | React Three XR | todo |

## Run it

```bash
npm install

npm run web        # browser, http://localhost:5173
npm run electron   # desktop window (starts Vite on 5174, then Electron)
npm run mobile     # Expo dev server; press i for iOS, a for Android
npm run terminal   # no server, no browser - it just runs in your shell
```

`mobile` needs an iOS simulator (macOS only), an Android emulator, or Expo Go on a
physical device. Metro is configured for the monorepo in `apps/mobile/metro.config.js` -
without the `watchFolders` entry it cannot see `packages/logic` two levels up.

Each app pins its own port with `strictPort`, so nothing silently drifts onto a port another app owns. You only ever need one running at a time.

## How the hook stays portable

`useTimer()` owns its own clock by default, ticking once a second with `setInterval`. Two of the targets do not have a clock to own: Remotion advances by frame, and a PDF is a single static snapshot. Both pass an `elapsed` value instead, and the hook derives state from it rather than ticking:

```js
useTimer()              // self-ticking - web, desktop, mobile, terminal, 3D, XR
useTimer({ elapsed })   // host owns time - Remotion frames, PDF snapshot
```

Same file, same state shape, same return value. Only the time source moves.

## Why this exists

React is not a web library. It is a component model and a reconciler, and `react-dom` is one renderer among many. The part of React you actually carry between all eight of these - state, effects, composition, custom hooks - is the part worth learning properly.

## License

MIT
