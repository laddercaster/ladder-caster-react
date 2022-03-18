import styled from 'styled-components';

export const _wallet = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const _body = styled.div`
  width: 100%;
  padding: 0 16px;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;
