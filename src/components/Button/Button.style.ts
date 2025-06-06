import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

import { ButtonSize, sizeWidthMapping } from './Button.type';

interface StyledButtonProps {
  $size?: ButtonSize;
  $bg: string;
  $border: string;
  $color: string;
}

export const ButtonContainer = styled.button<StyledButtonProps>`
  will-change: transform;
  cursor: pointer;
  ${typoStyleMap['body1_sb']};
  width: ${({ $size }) => sizeWidthMapping[$size ?? 'XL']};
  height: 54px;
  padding: 14px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ $border }) => $border};
  background-color: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};

  &:disabled {
    cursor: not-allowed;
    background-color: ${semanticColor.bgBtn.inactive.default};
    color: ${semanticColor.text.normal.sub3};
    border: none;
  }
`;
