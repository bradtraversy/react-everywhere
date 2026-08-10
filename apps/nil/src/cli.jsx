import { render } from 'react-nil';
import { Timer } from './Timer.jsx';

function countHostElements(node) {
  if (!node) return 0;
  return 1 + (node.children ?? []).reduce((n, c) => n + countHostElements(c), 0);
}

let ticks = 0;

const onTick = ({ label, running, finished }) => {
  // Skip the mount frame, before the effect has started the clock.
  if (!running && !finished) return;

  ticks++;
  console.log(`  ${label}  ${finished ? 'finished' : 'running'}`);
};

const onDone = () => {
  console.log('');
  console.log(`  ${ticks} renders, still nothing on screen.`);
  process.exit(0);
};

console.log('');
console.log('  react-nil - the same hook, with no renderer output');
console.log('');

const container = render(<Timer onTick={onTick} onDone={onDone} />);

console.log(`  component returned:  null`);
console.log(`  host elements made:  ${countHostElements(container.head)}`);
console.log('');
