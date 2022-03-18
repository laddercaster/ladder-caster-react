import styled from 'styled-components';

export const _tab = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
`;
