import styled from 'styled-components';

export const _connect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const _wallet = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 12px;
  margin-right: 4px;
  background: ${({ theme }) => theme.background['lowest']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  cursor: pointer;
  > span {
    top: 3px;
    font-size: 10px;
    font-weight: 500;
    color: ${({ theme }) => theme.text['base']};
    vertical-align: middle;
    padding-left: 6px;
    padding-right: 8px;
    line-height: 1;
  }
  > svg {
    min-height: 16px;
    height: 16px;
    min-width: 16px;
    width: 16px;
    color: ${({ theme }) => theme.text['base']};
  }
`;
