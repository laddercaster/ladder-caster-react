import styled from 'styled-components';
import { m } from 'framer-motion';

export const _spell = styled.div`
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => `${$height}px`};
  height: ${({ $height }) => `${$height}px`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 8px 40px 8px;
`;

export const _actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _board = styled(m.div)`
  width: 100%;
  max-width: 320px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 8px 16px;
  margin-bottom: 24px;
`;

export const _confirm = styled(m.div)`
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;

export const _title = styled.div`
  font-size: 22px;
  font-weight: 700;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  padding-bottom: 12px;
  margin-bottom: 12px;
`;

export const _description = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-shadow: ${({ theme }) => theme.shadow['text']};
  color: ${({ theme }) => theme.highlight['background']};
  text-align: center;
  padding: 12px;
`;

export const _list = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const _button = styled(m.button)`
  font-size: 16px;
  font-weight: 700;
  border: none;
  color: ${({ theme }) => theme.highlight['background']};
  padding: 12px 24px;
  border-radius: 8px;
  background: ${({ theme }) => theme.background['button_active']};
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  cursor: pointer;
`;

export const _limit = styled(m.div)`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  letter-spacing: 0.5px;
  padding-top: 4px;
`;