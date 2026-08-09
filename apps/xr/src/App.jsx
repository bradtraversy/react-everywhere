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

function Controls({ running, start, pause, reset }) {
  return (
    <group position={[0, -10.8, 0]}>
      <Button3D
        position={[-5, 0, 0]}
        color={OK}
        disabled={running}
        onClick={start}
      />
      <Button3D
        position={[0, 0, 0]}
        color={WARN}
        disabled={!running}
        onClick={pause}
      />
      <Button3D position={[5, 0, 0]} color="#7d8b9a" onClick={reset} />
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

export default function App({ emulated = false }) {
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  const vrSupported = useXRSupport('immersive-vr');
  const arSupported = useXRSupport('immersive-ar');
  const [xrError, setXrError] = useState(null);

  const enter = (mode) => {
    setXrError(null);
    Promise.resolve(mode === 'vr' ? store.enterVR() : store.enterAR()).catch(
      (err) => setXrError(err?.message ?? String(err))
    );
  };

  const color = finished ? DONE : remaining <= 10 ? WARN : OK;

  return (
    <main className="app">
      <Canvas
        camera={{ position: [0, 1.5, 0], fov: 50 }}
        // R3F aims a configured camera at the origin, which would point it at
        // the floor from eye height. Aim it at the scene instead.
        onCreated={({ camera }) => camera.lookAt(0, 1.7, -3)}
      >
        <color attach="background" args={['#0b0d10']} />
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 4, 1]} intensity={2.2} />
          <pointLight position={[-2, 1, -1]} intensity={12} color={color} />

          {/* One unit is one metre once a session starts, so the scene is
              scaled down and placed 3m in front of the viewer at eye height.
              The flat camera sits where a headset would. */}
          <group position={[0, 1.7, -3]} scale={0.12}>
            <Digits label={label} color={color} />
            <Ring progress={progress} color={color} />
            <Controls
              running={running}
              start={start}
              pause={pause}
              reset={reset}
            />
          </group>
        </XR>
      </Canvas>

      <div className="overlay">
        <span className="status">
          {finished ? 'finished' : running ? 'running' : 'paused'}
        </span>
        <div className="controls">
          <button onClick={() => enter('vr')} disabled={!vrSupported}>
            Enter VR
          </button>
          <button onClick={() => enter('ar')} disabled={!arSupported}>
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
          {xrError ? (
            <span className="sub">xr error: {xrError}</span>
          ) : emulated ? (
            <span className="sub">emulated Quest 3</span>
          ) : (
            !vrSupported &&
            !arSupported && <span className="sub">no xr device</span>
          )}
        </footer>
      </div>
    </main>
  );
}
