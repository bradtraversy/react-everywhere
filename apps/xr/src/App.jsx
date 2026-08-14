import { useTimer } from '@react-everywhere/logic';
import { Center, Text3D } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { Suspense, useEffect, useRef, useState } from 'react';

// Everything below is in metres, because that is what a unit means once an
// immersive session starts.
const RING_RADIUS = 1.1;
const RING_TUBE = 0.035;

// Where the timer hangs relative to the viewer. Centred a little below
// standing eye level and far enough out to read comfortably.
const SCENE = [0, 1.2, -2];
const CAMERA = [0, 1.2, 1];

const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';
const FONT_URL =
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

const store = createXRStore();

function Digits({ label, color }) {
  const group = useRef();

  useFrame(({ clock }) => {
    group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.25;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <Center cacheKey={label}>
          <Text3D
            font={FONT_URL}
            size={0.45}
            height={0.08}
            curveSegments={10}
            bevelEnabled
            bevelThickness={0.01}
            bevelSize={0.006}
            bevelSegments={4}
          >
            {label}
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.35}
              roughness={0.3}
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
        <torusGeometry args={[RING_RADIUS, RING_TUBE, 16, 120]} />
        <meshStandardMaterial color="#232a32" roughness={0.6} />
      </mesh>
      <mesh scale={[1, -1, 1]}>
        <torusGeometry args={[RING_RADIUS, RING_TUBE * 1.2, 16, 120, remaining]} />
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
        camera={{ position: CAMERA, fov: 50 }}
        // A configured camera is aimed at the origin by default, which points
        // it past the scene. Aim it at the timer instead.
        onCreated={({ camera }) => camera.lookAt(...SCENE)}
      >
        <color attach="background" args={['#0b0d10']} />
        <XR store={store}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 4, 2]} intensity={2.2} />
          <pointLight position={[-2, 1, 0]} intensity={6} color={color} />

          <group position={SCENE}>
            <Digits label={label} color={color} />
            <Ring progress={progress} color={color} />
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
          ) : (
            !vrSupported &&
            !arSupported && <span className="sub">no headset - try ?emulate</span>
          )}
        </footer>
      </div>
    </main>
  );
}
