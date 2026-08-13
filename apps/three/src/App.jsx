import { useTimer } from '@react-everywhere/logic';
import { Center, Text3D } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

const RING_RADIUS = 9;
const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';
const FONT_URL =
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

function Digits({ label, color }) {
  const group = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.3) * 0.35;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.12;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <Center cacheKey={label}>
          <Text3D
            font={FONT_URL}
            size={3.2}
            height={0.65}
            curveSegments={10}
            bevelEnabled
            bevelThickness={0.08}
            bevelSize={0.05}
            bevelSegments={4}
            castShadow
          >
            {label}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.1}
            />
          </Text3D>
        </Center>
      </Suspense>
    </group>
  );
}

function Ring({ progress, color }) {
  const remaining = Math.max(0.0001, (1 - progress) * Math.PI * 2);

  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh>
        <torusGeometry args={[RING_RADIUS, 0.28, 16, 120]} />
        <meshStandardMaterial color="#232a32" roughness={0.6} />
      </mesh>
      <mesh scale={[1, -1, 1]}>
        <torusGeometry args={[RING_RADIUS, 0.34, 16, 120, remaining]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}

function TimerScene({ label, progress, color }) {
  const height = useThree((state) => state.size.height);
  const sceneOffsetY =
    1.4 + Math.min(2.1, Math.max(0, (700 - height) / 100));

  return (
    <group position={[0, sceneOffsetY, 0]}>
      <Digits label={label} color={color} />
      <Ring progress={progress} color={color} />
    </group>
  );
}

export default function App() {
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  const color = finished ? DONE : remaining <= 10 ? WARN : OK;

  return (
    <main className="app">
      <Canvas camera={{ position: [0, 0, 26], fov: 50 }}>
        <color attach="background" args={['#0b0d10']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 10, 12]} intensity={2.2} />
        <pointLight position={[-10, -6, 6]} intensity={40} color={color} />
        <TimerScene label={label} progress={progress} color={color} />
      </Canvas>

      <div className="overlay">
        <span className="status">
          {finished ? 'finished' : running ? 'running' : 'paused'}
        </span>
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
          renderer: <strong style={{ color }}>react-three-fiber</strong>
        </footer>
      </div>
    </main>
  );
}
