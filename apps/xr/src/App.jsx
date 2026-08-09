import { useTimer } from '@react-everywhere/logic';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { useEffect, useRef, useState } from 'react';
import { glyphCells } from './glyphs.js';

const RING_RADIUS = 9;
const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';

const store = createXRStore();

function Digits({ label, color }) {
  const group = useRef();

  useFrame(({ clock }) => {
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.25;
  });

  return (
    <group ref={group}>
      {glyphCells(label).map((position, i) => (
        <mesh key={i} position={position}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
      ))}
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

// In an immersive session there is no DOM to click, so the controls are
// meshes the user pokes with a controller ray or a hand.
function Button3D({ position, color, disabled, onClick, children }) {
  return (
    <group position={position}>
      <mesh
        onClick={disabled ? undefined : onClick}
        onPointerDown={disabled ? undefined : onClick}
      >
        <boxGeometry args={[4.4, 1.8, 0.6]} />
        <meshStandardMaterial
          color={disabled ? '#1b2129' : '#232a32'}
          emissive={disabled ? '#000000' : color}
          emissiveIntensity={disabled ? 0 : 0.18}
        />
      </mesh>
      {children}
    </group>
  );
}

function Controls({ running, start, pause, reset, color }) {
  return (
    <group position={[0, -6.5, 0]}>
      <Button3D
        position={[-5, 0, 0]}
        color={color}
        disabled={running}
        onClick={start}
      />
      <Button3D
        position={[0, 0, 0]}
        color={color}
        disabled={!running}
        onClick={pause}
      />
      <Button3D position={[5, 0, 0]} color={color} onClick={reset} />
    </group>
  );
}

function useXRSupport(mode) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.xr
      ?.isSessionSupported(mode)
      .then((ok) => active && setSupported(ok))
      .catch(() => active && setSupported(false));
    return () => {
      active = false;
    };
  }, [mode]);

  return supported;
}

export default function App() {
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  const vrSupported = useXRSupport('immersive-vr');
  const arSupported = useXRSupport('immersive-ar');

  const color = finished ? DONE : remaining <= 10 ? WARN : OK;

  return (
    <main className="app">
      <Canvas camera={{ position: [0, 0, 26], fov: 50 }}>
        <color attach="background" args={['#0b0d10']} />
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[8, 10, 12]} intensity={2.2} />
          <pointLight position={[-10, -6, 6]} intensity={40} color={color} />
          <Digits label={label} color={color} />
          <Ring progress={progress} color={color} />
          <Controls
            running={running}
            start={start}
            pause={pause}
            reset={reset}
            color={color}
          />
        </XR>
      </Canvas>

      <div className="overlay">
        <span className="status">
          {finished ? 'finished' : running ? 'running' : 'paused'}
        </span>
        <div className="controls">
          <button onClick={() => store.enterVR()} disabled={!vrSupported}>
            Enter VR
          </button>
          <button onClick={() => store.enterAR()} disabled={!arSupported}>
            Enter AR
          </button>
          <button onClick={start} disabled={running}>
            Start
          </button>
          <button onClick={pause} disabled={!running}>
            Pause
          </button>
          <button onClick={reset}>Reset</button>
        </div>
        <footer className="chip">
          renderer: <strong style={{ color }}>@react-three/xr</strong>
          {!vrSupported && !arSupported && (
            <span className="sub">no headset detected - scene runs flat</span>
          )}
        </footer>
      </div>
    </main>
  );
}
