import styled from 'styled-components';
import { m } from 'framer-motion';

export const _market = styled(m.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const _header = styled.div`
  ${({ theme }) => theme.styles?.view?.['_header']};
`;

export const _title = styled.h3`
  ${({ theme }) => theme.styles?.view?.['_title']};
`;

export const _loading = styled.div`
  ${({ theme }) => theme.styles?.view?.['_loading']};
`;

export const _bar = styled.div`
  ${({ theme }) => theme.styles?.view?.['_bar']};
`;

export const _fill = styled.div`
  ${({ theme }) => theme.styles?.view?.['_fill']};
`;

export const _divider = styled.div`
  ${({ theme }) => theme.styles?.view?.['_divider']};
`;

export const _body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const _fractal = styled.button`
  min-width: 200px;
  width: 200px;
  min-height: 72px;
  height: 72px;
  padding: 12px 18px;
  font-size: 18px;
  border-radius: 12px;
  background: ${({ theme }) => theme.vendors.fractal['background']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  border: none;
  > svg {
    min-width: 100%;
    width: 100%;
    min-height: 100%;
    height: 100%;
    color: ${({ theme }) => theme.vendors.fractal['text']};
    cursor: pointer;
  }
`;

export const _holaplex = styled.button`
  min-width: 200px;
  width: 200px;
  min-height: 72px;
  height: 72px;
  padding: 12px 12px 12px 8px;
  font-size: 32px;
  border-radius: 12px;
  text-align: center;
  background: ${({ theme }) => theme.vendors.holaplex['background']};
  box-shadow: ${({ theme }) => theme.shadow['frost']};
  font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  color: ${({ theme }) => theme.vendors.holaplex['text']};
  cursor: pointer;
  border: none;
  white-space: nowrap;
  margin-bottom: 16px;
  > span {
    margin-right: 8px;
    transform: scale(0.8);
  }
`;
