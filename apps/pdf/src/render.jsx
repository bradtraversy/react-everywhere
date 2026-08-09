import { renderToFile } from '@react-pdf/renderer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Report } from './Report.jsx';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(dir, '..', 'out', 'timer.pdf');

await mkdir(path.dirname(out), { recursive: true });
await renderToFile(<Report />, out);

console.log(`wrote ${out}`);
