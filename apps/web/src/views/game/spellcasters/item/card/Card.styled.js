import styled from 'styled-components';
import { m } from 'framer-motion';

export const _card = styled(m.div)`
  min-width: 80px;
  width: 80px;
  min-height: 80px;
  height: 80px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border: 3px solid
    ${({ theme, $hue }) =>
      $hue ? `hsl(${$hue},32%,42%)` : theme.border['high']};
  cursor: pointer;
  overflow: hidden;
`;

export const _icon = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  > svg {
    min-width: 36px;
    width: 36px;
    min-height: 36px;
    height: 36px;
    color: ${({ theme }) => theme.text['base']};
  }
`;

export const _caster = styled(m.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
