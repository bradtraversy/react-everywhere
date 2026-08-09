import { useTimer } from '@react-everywhere/logic';
import {
  Circle,
  Document,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer';

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';

const SNAPSHOTS = [0, 15, 30, 45, 59, 60];

function accentFor(remaining, finished) {
  return finished ? DONE : remaining <= 10 ? WARN : OK;
}

// One hook call per row. Each instance is handed a different moment.
function Row({ elapsed }) {
  const { label, progress, finished, remaining } = useTimer({ elapsed });
  const accent = accentFor(remaining, finished);

  return (
    <View style={styles.row}>
      <Text style={styles.cellTime}>{`${elapsed}s`}</Text>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={[styles.cellStatus, { color: accent }]}>
        {finished ? 'finished' : 'running'}
      </Text>
      <View style={styles.barTrack}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.round(progress * 100)}%`, backgroundColor: accent },
          ]}
        />
      </View>
      <Text style={styles.cellPct}>{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
}

function Dial({ elapsed }) {
  const { label, progress, finished, remaining } = useTimer({ elapsed });
  const accent = accentFor(remaining, finished);

  return (
    <View style={styles.dialWrap}>
      <Svg width="160" height="160" viewBox="0 0 160 160">
        <Circle
          cx="80"
          cy="80"
          r={RADIUS}
          stroke="#232a32"
          strokeWidth="10"
          fill="none"
        />
        <Circle
          cx="80"
          cy="80"
          r={RADIUS}
          stroke={accent}
          strokeWidth="10"
          fill="none"
          strokeDasharray={`${CIRCUMFERENCE * (1 - progress)} ${CIRCUMFERENCE}`}
          transform="rotate(-90 80 80)"
        />
      </Svg>
      <Text style={styles.dialLabel}>{label}</Text>
      <Text style={styles.dialStatus}>
        {finished ? 'FINISHED' : 'RUNNING'}
      </Text>
    </View>
  );
}

export function Report() {
  return (
    <Document title="React Everywhere - Session Report" author="react-everywhere">
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Session Report</Text>
        <Text style={styles.sub}>
          Rendered by React. No browser, no server, no screenshot.
        </Text>

        <Dial elapsed={45} />

        <Text style={styles.tableHeading}>Timeline</Text>
        <View style={styles.table}>
          <View style={[styles.row, styles.headRow]}>
            <Text style={styles.cellTime}>at</Text>
            <Text style={styles.cellLabel}>remaining</Text>
            <Text style={styles.cellStatus}>state</Text>
            <Text style={styles.barTrackHead}>progress</Text>
            <Text style={styles.cellPct} />
          </View>
          {SNAPSHOTS.map((elapsed) => (
            <Row key={elapsed} elapsed={elapsed} />
          ))}
        </View>

        <Text style={styles.note}>
          Every row above is a separate useTimer() call, the same hook that
          drives the web, desktop, mobile, terminal, 3D and video builds.
        </Text>

        <Text style={styles.chip} fixed>
          renderer: @react-pdf/renderer
        </Text>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0b0d10',
    color: '#e8eef5',
    paddingVertical: 48,
    paddingHorizontal: 56,
    fontFamily: 'Helvetica',
  },
  heading: { fontSize: 26, marginBottom: 6 },
  sub: { fontSize: 11, color: '#7d8b9a', marginBottom: 28 },
  dialWrap: { alignItems: 'center', marginBottom: 32 },
  dialLabel: {
    fontFamily: 'Courier-Bold',
    fontSize: 30,
    marginTop: -98,
    marginBottom: 4,
  },
  dialStatus: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#7d8b9a',
    marginBottom: 60,
  },
  tableHeading: { fontSize: 13, marginBottom: 10 },
  table: { borderTopWidth: 1, borderTopColor: '#232a32' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#232a32',
  },
  headRow: { borderBottomColor: '#33404d' },
  cellTime: { width: 44, fontSize: 10, color: '#7d8b9a' },
  cellLabel: { width: 74, fontFamily: 'Courier-Bold', fontSize: 12 },
  cellStatus: { width: 74, fontSize: 10, color: '#7d8b9a' },
  barTrack: {
    flexGrow: 1,
    height: 8,
    backgroundColor: '#232a32',
    borderRadius: 4,
    marginRight: 12,
  },
  barTrackHead: { flexGrow: 1, fontSize: 10, color: '#7d8b9a', marginRight: 12 },
  barFill: { height: 8, borderRadius: 4 },
  cellPct: { width: 38, fontSize: 10, textAlign: 'right', color: '#7d8b9a' },
  note: { marginTop: 26, fontSize: 9, color: '#7d8b9a', lineHeight: 1.5 },
  chip: {
    position: 'absolute',
    bottom: 32,
    left: 56,
    fontFamily: 'Courier',
    fontSize: 9,
    color: '#35d6a4',
  },
});
