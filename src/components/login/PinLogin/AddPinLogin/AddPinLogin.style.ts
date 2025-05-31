import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h2`
  margin: 120px 0 7px;
  ${typoStyleMap['head1']};
  color: ${semanticColor.text.normal.primary};
`;

export const DotWrapper = styled.div`
  display: flex;
  gap: 21px;
  margin-bottom: 76px;
`;

export const Dot = styled.div<{ filled: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${({ filled }) =>
    filled ? semanticColor.bg.primary : semanticColor.bg.subtle};
`;

export const KeypadWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 35px 0px;
  background-color: ${semanticColor.bg.primary};
  margin-top: 128px;

  @media (min-width: 600px) {
    max-width: none;
    margin: 250px 0 0;
  }
`;

export const KeyButton = styled.button`
  height: 55px;
  ${typoStyleMap['title2']};
  color: ${semanticColor.text.normal.onPrimary};
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 24px;

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }
`;


export const RegisterButtonWrapper = styled.div`
  background-color: transparent;
  display: flex;
  justify-content: center;
`;

export const RegisterButton = styled.button`
  background-color: transparent;
  color: #000000;
  font-size: 14px;
  border: none;
  cursor: pointer;
`;