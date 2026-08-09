import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

async function hasRealDevice() {
  if (!navigator.xr) return false;
  const [vr, ar] = await Promise.all([
    navigator.xr.isSessionSupported('immersive-vr').catch(() => false),
    navigator.xr.isSessionSupported('immersive-ar').catch(() => false),
  ]);
  return vr || ar;
}

async function installEmulator() {
  const [{ XRDevice, metaQuest3 }, { DevUI }] = await Promise.all([
    import('iwer'),
    import('@iwer/devui'),
  ]);

  const device = new XRDevice(metaQuest3);
  // Chrome exposes navigator.xr with no headset attached, so IWER would
  // otherwise decline to replace it.
  device.installRuntime({ forceInstall: true });
  device.installDevUI(DevUI);
}

async function boot() {
  const params = new URLSearchParams(location.search);

  // Only stand in for a device that is not there. A real headset, or the
  // Immersive Web Emulator extension, reports support and is left alone.
  // ?native opts out entirely.
  const emulated =
    !params.has('native') && !(await hasRealDevice()) ? true : false;

  if (emulated) await installEmulator();

  const { default: App } = await import('./App.jsx');

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App emulated={emulated} />
    </StrictMode>
  );
}

boot();
