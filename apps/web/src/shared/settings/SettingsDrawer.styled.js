import styled from 'styled-components';
import { m } from 'framer-motion';

export const _settings = styled.div`
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height - 80}px` : '100px')};
  height: 100%;
  max-height: ${({ $height }) => ($height ? `${$height - 80}px` : '')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const _body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: scroll;
`;

export const _disconnect = styled(m.div)`
  width: 100%;
  min-height: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['faded']};
  cursor: pointer;
`;

export const _section = styled(m.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 32px;
  width: 100%;
  padding: 0px 32px 8px;
`;
