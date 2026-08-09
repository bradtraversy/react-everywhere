import { render } from '@react-email/render';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Summary } from './Summary.jsx';

const dir = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(dir, '..', 'out');

const html = await render(<Summary elapsed={60} />);
const text = await render(<Summary elapsed={60} />, { plainText: true });

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'summary.html'), html);
await writeFile(path.join(outDir, 'summary.txt'), text);

console.log(`wrote ${path.join(outDir, 'summary.html')}`);
console.log(`wrote ${path.join(outDir, 'summary.txt')}`);
