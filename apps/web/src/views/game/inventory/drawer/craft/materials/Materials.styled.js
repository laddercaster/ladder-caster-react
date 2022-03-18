import styled from 'styled-components';
import { TextureFur } from 'design/textures/fur.texture';
import { bgTexture } from 'design/textures';

export const _materials = styled.div`
  width: 100%;
  height: 100%;
  max-height: ${({ $height }) => $height && `${$height - 80}px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 16px 0 16px;
`;

export const _breakpoint = styled.div`
  display: flex;
  width: 100%;
  height: 3px;
  min-height: 3px;
  max-height: 3px;
  border-radius: 50px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
`;

export const _grid = styled.div`
  width: 100%;
  overflow: scroll;
`;

export const _container = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 0 16px 16px 16px;
`;

export const _selected = styled.div`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 12px;
`;

export const _material = styled.div`
  width: 64px;
  min-width: 64px;
  min-height: 64px;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  margin-left: 4px;
  border-radius: 12px;
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['divider']};
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const _title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const _confirm = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const _text = styled.div`
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text['base']};
  margin-bottom: 16px;
`;

export const _button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme['legendary']?.['tile']};
  background-image: ${({ theme }) =>
    bgTexture(TextureFur(theme['legendary']?.['texture'], 0.16))};
  background-size: 8px;
  background-repeat: repeat;
  box-shadow: ${({ theme }) => theme.shadow['glass']};
  border: 2px solid ${({ theme }) => theme['legendary']?.['dark_tile']};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme['legendary']?.['text']};
  text-shadow: 2px 2px 3px ${({ theme }) => theme['legendary']?.['dark_tile']};
  letter-spacing: 0.5px;
  cursor: pointer;
`;

export const _odds = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const _lowest = styled.div`
  min-width: 120px;
  width: 120px;
  min-height: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const _highest = styled.div`
  min-width: 120px;
  width: 120px;
  min-height: 120px;
  height: 120px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

export const _percent = styled.div`
  width: 100%;
  height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 16px;
`;

export const _chance = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text['base']};
  text-shadow: ${({ theme }) => theme.shadow['text']};
  background: ${({ theme }) => theme.background['base']};
  box-shadow: ${({ theme }) => theme.shadow['cutout']};
  border-radius: 8px;
  padding: 8px 12px;
`;
