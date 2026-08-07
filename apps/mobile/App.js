import { useTimer } from '@react-everywhere/logic';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const RADIUS = 140;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const OK = '#35d6a4';
const WARN = '#f5b544';
const DONE = '#ff5f56';

const MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

function Button({ label, onPress, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  const accent = finished ? DONE : remaining <= 10 ? WARN : OK;

  return (
    <View style={styles.app}>
      <StatusBar style="light" />

      <View style={styles.dial}>
        <Svg viewBox="0 0 320 320" style={styles.svg}>
          <Circle
            cx="160"
            cy="160"
            r={RADIUS}
            stroke="#232a32"
            strokeWidth="14"
            fill="none"
          />
          <Circle
            cx="160"
            cy="160"
            r={RADIUS}
            stroke={accent}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * progress}
            transform="rotate(-90 160 160)"
          />
        </Svg>

        <View style={styles.readout} pointerEvents="none">
          <Text style={styles.digits}>{label}</Text>
          <Text style={styles.status}>
            {finished ? 'FINISHED' : running ? 'RUNNING' : 'PAUSED'}
          </Text>
        </View>
      </View>

      <View style={styles.controls}>
        <Button label="Start" onPress={start} disabled={running} />
        <Button label="Pause" onPress={pause} disabled={!running} />
        <Button label="Reset" onPress={reset} />
      </View>

      <View style={styles.chip}>
        <Text style={styles.chipText}>renderer: </Text>
        <Text style={[styles.chipStrong, { color: accent }]}>react-native</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#0b0d10',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  dial: {
    width: 300,
    height: 300,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  readout: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  digits: {
    fontFamily: MONO,
    fontSize: 72,
    fontWeight: '600',
    color: '#e8eef5',
  },
  status: {
    fontSize: 12,
    letterSpacing: 3,
    color: '#7d8b9a',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#14181d',
    borderWidth: 1,
    borderColor: '#232a32',
    borderRadius: 10,
  },
  buttonPressed: {
    backgroundColor: '#1b2129',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#e8eef5',
    fontSize: 15,
    fontWeight: '500',
  },
  chip: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#232a32',
    borderRadius: 999,
  },
  chipText: {
    fontFamily: MONO,
    fontSize: 13,
    color: '#7d8b9a',
  },
  chipStrong: {
    fontFamily: MONO,
    fontSize: 13,
    fontWeight: '600',
  },
});
