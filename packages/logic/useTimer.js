import { useEffect, useReducer } from 'react';

export const DURATION = 60;

function init(duration) {
  return { duration, remaining: duration, running: false };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        running: true,
        remaining: state.remaining === 0 ? state.duration : state.remaining,
      };
    case 'PAUSE':
      return { ...state, running: false };
    case 'RESET':
      return init(state.duration);
    case 'TICK': {
      const remaining = Math.max(0, state.remaining - 1);
      return { ...state, remaining, running: remaining > 0 };
    }
    default:
      return state;
  }
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Pass `elapsed` when the host owns the clock instead of us (Remotion frames,
// a static PDF snapshot). The hook then derives state from it and skips ticking.
export function useTimer({ duration = DURATION, elapsed } = {}) {
  const controlled = typeof elapsed === 'number';
  const [state, dispatch] = useReducer(reducer, duration, init);

  useEffect(() => {
    if (controlled || !state.running) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(id);
  }, [controlled, state.running]);

  const remaining = controlled
    ? Math.max(0, duration - Math.floor(elapsed))
    : state.remaining;
  const running = controlled ? elapsed > 0 && elapsed < duration : state.running;

  return {
    duration,
    remaining,
    running,
    finished: remaining === 0,
    progress: 1 - remaining / duration,
    label: formatTime(remaining),
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    reset: () => dispatch({ type: 'RESET' }),
    toggle: () => dispatch({ type: running ? 'PAUSE' : 'START' }),
  };
}
