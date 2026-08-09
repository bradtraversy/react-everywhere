import { Composition } from 'remotion';
import { Timer } from './Timer.jsx';

const FPS = 30;
const SECONDS = 60;

export const RemotionRoot = () => (
  <Composition
    id="Timer"
    component={Timer}
    durationInFrames={FPS * SECONDS + 1}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
