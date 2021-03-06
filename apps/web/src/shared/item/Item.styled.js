import styled from 'styled-components';
import { m } from 'framer-motion';

export const _item = styled(m.div)`
  min-width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  width: ${({ $grid }) => ($grid ? `calc(50% - 8px)` : '100%')};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 16px;
  margin: 0 8px;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _overlay = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_high']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
`;

export const _float = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_low']};
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
`;

export const _img = styled.img`
  position: relative;
  z-index: ${({ theme }) => theme.zindex['drawer_base']};
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100px')};
  border-radius: 8px;
`;

export const _level = styled.div`
  min-width: 40px;
  width: 40px;
  min-height: 40px;
  height: 40px;
  border-radius: 12px 8px 8px 8px;
  top: 4px;
  left: 4px;
  background: ${({ theme }) => theme.background['highest']};
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text['active']};
    text-shadow: ${({ theme }) => theme.shadow['text']};
  }
`;

export const _background = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ $equipped }) => ($equipped ? '12px' : '12px')};
  background: ${({ theme, $rarity }) =>
    `radial-gradient(${theme.rarity[$rarity]}, ${theme.background['lowest']})`};
  border: 2px solid ${({ theme, $rarity }) => theme.rarity[$rarity]};
  opacity: 0.6;
`;

export const _selected = styled.div`
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const _checkmark = styled.div`
  min-width: 32px;
  width: 32px;
  min-height: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.background['highest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
`;
