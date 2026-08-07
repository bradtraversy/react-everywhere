import { useTimer } from '@react-everywhere/logic';
import { Box, Text, useApp, useInput, useStdin } from 'ink';
import { bigDigits } from './digits.js';

const BAR_WIDTH = 32;

export default function App() {
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();
  const { label, progress, running, finished, remaining, start, pause, reset } =
    useTimer();

  useInput(
    (input) => {
      if (input === 's') start();
      if (input === 'p') pause();
      if (input === 'r') reset();
      if (input === 'q') exit();
    },
    // Must be a real boolean: Ink checks `isActive === false`, and
    // isRawModeSupported is stdin.isTTY, which Node leaves undefined when piped.
    { isActive: Boolean(isRawModeSupported) }
  );

  const color = finished ? 'red' : remaining <= 10 ? 'yellow' : 'green';
  const filled = Math.round(progress * BAR_WIDTH);
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="column" marginBottom={1}>
        {bigDigits(label).map((row, i) => (
          <Text key={i} color={color} bold>
            {row}
          </Text>
        ))}
      </Box>

      <Text color={color}>{bar}</Text>

      <Box marginTop={1}>
        <Text dimColor>
          {finished ? 'FINISHED' : running ? 'RUNNING' : 'PAUSED'}
        </Text>
      </Box>

      <Text dimColor>
        {isRawModeSupported
          ? '[s]tart  [p]ause  [r]eset  [q]uit'
          : '(no tty - keyboard controls disabled)'}
      </Text>

      <Box marginTop={1}>
        <Text dimColor>renderer: </Text>
        <Text color={color} bold>
          ink
        </Text>
      </Box>
    </Box>
  );
}
