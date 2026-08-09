import { useTimer } from '@react-everywhere/logic';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

const RADIUS = 300;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';
const MONO = 'ui-monospace, "SF Mono", "Cascadia Code", monospace';

export const Timer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Remotion owns the clock, so the hook is driven by the frame number
  // instead of ticking on its own.
  const { label, progress, finished, remaining } = useTimer({
    elapsed: frame / fps,
  });

  const accent = finished ? DONE : remaining <= 10 ? WARN : OK;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0b0d10',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ position: 'relative', width: 700, height: 700 }}>
        <svg width="700" height="700" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="350"
            cy="350"
            r={RADIUS}
            fill="none"
            stroke="#232a32"
            strokeWidth="28"
          />
          <circle
            cx="350"
            cy="350"
            r={RADIUS}
            fill="none"
            stroke={accent}
            strokeWidth="28"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * progress}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 180,
              fontWeight: 600,
              color: '#e8eef5',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 24,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: '#7d8b9a',
            }}
          >
            {finished ? 'finished' : 'running'}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 60,
          fontFamily: MONO,
          fontSize: 24,
          color: '#7d8b9a',
          border: '1px solid #232a32',
          borderRadius: 999,
          padding: '14px 28px',
        }}
      >
        renderer: <strong style={{ color: accent }}>remotion</strong>
      </div>
    </AbsoluteFill>
  );
};
