import React, { useEffect, useState } from 'react';
import { _progress, _bar, _fill } from './Progress.styled';
import { AnimateProgress } from '../animations/AnimateProgress';
import { LEVEL_BOUNDS } from 'core/utils/numbers';

const Progress = ({ caster }) => {
  const [rank, setRank] = useState({});

  useEffect(() => {
    if (caster) {
      const level = caster?.level;
      const current_level = level;
      const next_level = level + 1;
      const from_xp = LEVEL_BOUNDS[level - 1];
      const to_xp = LEVEL_BOUNDS[level];
      setRank({
        level: current_level,
        next_level,
        from_xp,
        to_xp,
      });
    }
  }, [caster]);

  const from_start = caster?.xp - rank?.from_xp;
  const total = rank?.to_xp - rank?.from_xp;
  const difference = from_start ? from_start / total : 0;
  const minimum = !difference ? 0.05 : difference;
  const fill = -(100 - minimum * 100);

  return (
    <_progress>
      <_bar>
        <AnimateProgress fill={fill}>
          <_fill />
        </AnimateProgress>
      </_bar>
    </_progress>
  );
};

export default Progress;
