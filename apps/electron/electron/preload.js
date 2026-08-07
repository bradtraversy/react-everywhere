import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('host', {
  electron: process.versions.electron,
  chrome: process.versions.chrome,
});
