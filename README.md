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
| 5 | 3D | React Three Fiber | done |
| 6 | Video | Remotion | done |
| 7 | PDF | `@react-pdf/renderer` | done |
| 8 | XR | React Three XR | done |

## Run it

```bash
npm install

npm run web        # browser, http://localhost:5173
npm run electron   # desktop window (starts Vite on 5174, then Electron)
npm run mobile     # Expo dev server; press i for iOS, a for Android
npm run terminal   # no server, no browser - it just runs in your shell
npm run three      # 3D scene, http://localhost:5176
npm run video      # Remotion studio
npm run video:render   # renders apps/video/out/timer.mp4, no server involved
npm run pdf        # writes apps/pdf/out/timer.pdf - no server, no browser
npm run xr         # http://localhost:5177
```

The XR build runs as a normal 3D scene in any browser. Entering a session needs a device,
and there are three ways to get one:

| | how |
|---|---|
| A real headset | open the app in its browser, no flags |
| [Immersive Web Emulator](https://chromewebstore.google.com/detail/immersive-web-emulator/cgffilbpcibhmcfbgggfhfolhkfbhmik) extension | install it, then use the plain URL - **recommended** |
| No install at all | `?emulate` for a session, `?emulate&devui` to also drive the headset and hands |

`?emulate` embeds [IWER](https://github.com/meta-quest/immersive-web-emulator) as a stand-in
Quest 3. Do not combine it with the extension: it installs over the top of whatever is
already on `navigator.xr` and the two will fight.

WebXR needs a secure context: localhost counts, but a headset connecting over the LAN
will need https or a tunnel.

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

## Check the claim yourself

Do not take the premise on faith. There is one hook, and it has never been edited:

```bash
find . -name "useTimer*" -not -path "*/node_modules/*"
git log --oneline -- packages/logic/useTimer.js
```

One file, one commit, eight renderers importing it.

## Why this exists

React is not a web library. It is a component model and a reconciler, and `react-dom` is one renderer among many. The part of React you actually carry between all eight of these - state, effects, composition, custom hooks - is the part worth learning properly.

## License

MIT
