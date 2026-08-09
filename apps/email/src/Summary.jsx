import { useTimer } from '@react-everywhere/logic';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

const SNAPSHOTS = [0, 15, 30, 45, 59, 60];

const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';
const MONO = 'ui-monospace, "SF Mono", Consolas, monospace';

function accentFor(remaining, finished) {
  return finished ? DONE : remaining <= 10 ? WARN : OK;
}

// A bar built from nested tables, because email clients have no flexbox and
// no SVG worth relying on.
function Bar({ progress, color }) {
  return (
    <table
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      role="presentation"
      style={styles.barTrack}
    >
      <tbody>
        <tr>
          <td
            style={{
              ...styles.barFill,
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: color,
            }}
          />
          <td />
        </tr>
      </tbody>
    </table>
  );
}

function Row({ elapsed }) {
  const { label, progress, finished, remaining } = useTimer({ elapsed });
  const accent = accentFor(remaining, finished);

  return (
    <tr>
      {/* Trailing spaces collapse away in HTML but keep the columns apart in
          the plain-text version, which is generated from this same markup. */}
      <td style={styles.cellAt}>{`${elapsed}s `}</td>
      <td style={styles.cellLabel}>{`${label} `}</td>
      <td style={{ ...styles.cellState, color: accent }}>
        {finished ? 'finished ' : 'running '}
      </td>
      <td style={styles.cellBar}>
        <Bar progress={progress} color={accent} />
      </td>
    </tr>
  );
}

export function Summary({ elapsed = 60 }) {
  const { label, finished, remaining, progress } = useTimer({ elapsed });
  const accent = accentFor(remaining, finished);

  return (
    <Html>
      <Head />
      <Preview>{`Session ${finished ? 'complete' : 'in progress'} - ${label} remaining`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Session Report</Heading>
          <Text style={styles.sub}>
            Rendered by React. No JavaScript runs in an inbox, so this is the
            timer frozen at one moment.
          </Text>

          <Section style={styles.hero}>
            <Text style={{ ...styles.bigTime, color: accent }}>{label}</Text>
            <Text style={styles.state}>
              {finished ? 'FINISHED' : 'RUNNING'}
            </Text>
            <Bar progress={progress} color={accent} />
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.tableHeading}>Timeline</Text>
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
          >
            <tbody>
              {SNAPSHOTS.map((s) => (
                <Row key={s} elapsed={s} />
              ))}
            </tbody>
          </table>

          <Hr style={styles.hr} />

          <Text style={styles.chip}>renderer: @react-email/components</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default Summary;

const styles = {
  body: {
    backgroundColor: '#0b0d10',
    color: '#e8eef5',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    margin: 0,
    padding: '32px 0',
  },
  container: {
    backgroundColor: '#14181d',
    border: '1px solid #232a32',
    borderRadius: '12px',
    margin: '0 auto',
    maxWidth: '560px',
    padding: '32px',
  },
  heading: { fontSize: '24px', margin: '0 0 6px' },
  sub: { color: '#7d8b9a', fontSize: '13px', lineHeight: '20px', margin: '0 0 24px' },
  hero: { textAlign: 'center', margin: '0 0 8px' },
  bigTime: {
    fontFamily: MONO,
    fontSize: '56px',
    fontWeight: 600,
    margin: '0 0 4px',
  },
  state: {
    color: '#7d8b9a',
    fontSize: '11px',
    letterSpacing: '3px',
    margin: '0 0 16px',
  },
  hr: { borderColor: '#232a32', margin: '24px 0' },
  tableHeading: { fontSize: '13px', margin: '0 0 12px' },
  cellAt: { color: '#7d8b9a', fontSize: '12px', padding: '8px 0', width: '48px' },
  cellLabel: { fontFamily: MONO, fontSize: '14px', width: '72px' },
  cellState: { fontSize: '12px', width: '76px' },
  cellBar: { paddingLeft: '8px' },
  barTrack: {
    backgroundColor: '#232a32',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
  },
  barFill: { height: '8px', lineHeight: '8px', fontSize: 0 },
  chip: { color: '#35d6a4', fontFamily: MONO, fontSize: '12px', margin: 0 },
};
