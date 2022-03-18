import styled from 'styled-components';

export const _nft = styled.img`
  position: relative;
  z-index: ${({ theme, $zindex }) => ($zindex ? theme.zindex[$zindex] : '')};
  min-width: 100%;
  width: 100%;
  min-height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
  height: ${({ $height }) => ($height ? `${$height}px` : '100%')};
`;
