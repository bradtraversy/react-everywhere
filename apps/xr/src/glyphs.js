const GLYPHS = {
  0: ['###', '# #', '# #', '# #', '###'],
  1: ['  #', '  #', '  #', '  #', '  #'],
  2: ['###', '  #', '###', '#  ', '###'],
  3: ['###', '  #', '###', '  #', '###'],
  4: ['# #', '# #', '###', '  #', '  #'],
  5: ['###', '#  ', '###', '  #', '###'],
  6: ['###', '#  ', '###', '# #', '###'],
  7: ['###', '  #', '  #', '  #', '  #'],
  8: ['###', '# #', '###', '# #', '###'],
  9: ['###', '# #', '###', '  #', '###'],
  ':': [' ', '#', ' ', '#', ' '],
};

const GAP = 1;

// Turns "1:00" into cube positions, centred on the origin.
export function glyphCells(text) {
  const chars = [...text];
  const widths = chars.map((c) => GLYPHS[c]?.[0].length ?? 1);
  const total = widths.reduce((a, b) => a + b, 0) + GAP * (chars.length - 1);

  const cells = [];
  let cursor = -total / 2;

  chars.forEach((char, i) => {
    GLYPHS[char]?.forEach((row, r) => {
      [...row].forEach((cell, col) => {
        if (cell === '#') {
          cells.push([cursor + col + 0.5, 2 - r, 0]);
        }
      });
    });
    cursor += widths[i] + GAP;
  });

  return cells;
}
