import { useMemo } from 'react';
import { nanoid } from 'nanoid';

export const useKeys = (num, listen) => {
  return useMemo(
    () => new Array(num || 1).fill('').map(() => ({ key: nanoid() })),
    [listen],
  );
};
