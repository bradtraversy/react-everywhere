import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// Opt-in device emulation. IWER has to patch navigator.xr before anything
// reads it, which is why App is imported dynamically below rather than at
// the top of the file.
async function installEmulator({ withDevUI }) {
  const { XRDevice, metaQuest3 } = await import('iwer');

  const device = new XRDevice(metaQuest3);
  // Chrome exposes navigator.xr even with no headset attached, so IWER would
  // otherwise decline to replace it.
  device.installRuntime({ forceInstall: true });

  // Opt-in separately: @iwer/devui bundles its own copy of three, so keep it
  // off the default path.
  if (withDevUI) {
    const { DevUI } = await import('@iwer/devui');
    device.installDevUI(DevUI);
  }
}

async function boot() {
  const params = new URLSearchParams(location.search);

  if (params.has('emulate')) {
    await installEmulator({ withDevUI: params.has('devui') });
  }

  const { default: App } = await import('./App.jsx');

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

boot();
