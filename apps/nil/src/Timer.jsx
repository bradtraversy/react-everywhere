import { useTimer } from '@react-everywhere/logic';
import { useEffect } from 'react';

// No host elements. No <div>, no <Box>, no <mesh>. This component renders
// nothing at all, and every visible line comes from the effect below.
export function Timer({ onTick, onDone }) {
  const { label, running, finished, remaining, start } = useTimer();

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    onTick({ label, running, finished, remaining });
    if (finished) onDone();
  }, [label, running, finished]);

  return null;
}
