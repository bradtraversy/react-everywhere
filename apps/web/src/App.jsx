import { useTimer } from '@react-everywhere/logic';

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function App() {
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  const state = finished ? 'done' : remaining <= 10 ? 'warn' : 'ok';

  return (
    <main className="app" data-state={state}>
      <div className="dial">
        <svg viewBox="0 0 320 320" aria-hidden="true">
          <circle className="track" cx="160" cy="160" r={RADIUS} />
          <circle
            className="fill"
            cx="160"
            cy="160"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * progress}
          />
        </svg>
        <div className="readout">
          <span className="digits">{label}</span>
          <span className="status">
            {finished ? 'finished' : running ? 'running' : 'paused'}
          </span>
        </div>
      </div>

      <div className="controls">
        <button onClick={start} disabled={running}>
          Start
        </button>
        <button onClick={pause} disabled={!running}>
          Pause
        </button>
        <button onClick={reset}>Reset</button>
      </div>

      <footer className="chip">
        renderer: <strong>react-dom</strong>
      </footer>
    </main>
  );
}
