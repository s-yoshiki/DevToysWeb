'use client';

import { useMemo, useState } from 'react';
import { analyzeMojibake } from '../functions/mojibake';

const SAMPLE = 'æ—¥æœ¬èªžãŒæ–‡å­—åŒ–ã‘ã—ã¾ã—ãŸ';

export const useMojibake = () => {
  const [input, setInput] = useState('');

  const candidates = useMemo(() => analyzeMojibake(input), [input]);
  const best = candidates[0] ?? null;

  const clear = () => setInput('');
  const loadSample = () => setInput(SAMPLE);

  return { input, setInput, candidates, best, clear, loadSample };
};
