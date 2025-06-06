import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 22px);
`;

export const MainContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 11px 0px 80px 0px;
  margin-bottom: 40px;
`;

export const SubTitle = styled.div`
  margin-top: 12px;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const TableContainer = styled.div`
  margin-top: 12px;
  padding: 10px;
  height: fit-content;
  border-top: 1px solid ${semanticColor.border.active.default};
  border-bottom: 1px solid ${semanticColor.border.active.default};
`;

export const TableItem = styled.span`
  padding: 18px 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${semanticColor.border.inactive.default};
`;

export const TableItemKey = styled.span`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
`;

export const TableItemValue = styled.span<{ $isStrong?: boolean }>`
  ${typoStyleMap['body2_b']};
  color: ${({ $isStrong }) =>
    $isStrong ? semanticColor.text.normal.accent : semanticColor.text.normal.sub2};
`;

export const CaptionContainer = styled.div`
  padding: 12px 8px;
`;

export const Caption = styled.div`
  ${typoStyleMap['caption1_m']};
  color: ${semanticColor.text.normal.sub2};
`;

export const LoanApplicationContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 13px 0px 30px 0px;
`;

export const Description = styled.div`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
  margin-top: 5px;
  margin-bottom: 22px;
`;

export const SubDescriptionContainer = styled.div`
  margin: 10px 0px 20px 10px;
`;

export const SubDescription = styled.span<{ $isStrong?: boolean }>`
  ${typoStyleMap['caption1_m']};
  color: ${({ $isStrong }) =>
    $isStrong ? semanticColor.text.normal.accent : semanticColor.text.normal.sub3};
`;

export const MiniTitle = styled.div`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub1};
  padding-left: 10px;
`;

export const SliderContainer = styled.div`
  margin: 7px 0px 20px 0px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SliderTitle = styled.div`
  margin: 0 auto;
  ${typoStyleMap['body2_sb']};
  color: ${semanticColor.text.normal.accent};
`;

export const Slider = styled.input<{ value: number; min?: number; max?: number }>`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  outline: none;
  background-image: ${({ value, min = 0, max = 100 }) => {
    const percent = ((value - min) / (max - min)) * 100;
    return `
    linear-gradient(
      to right,
      ${semanticColor.bg.primary} 0%,
      ${semanticColor.bg.primary} ${percent}%,
      transparent ${percent}%,
      transparent 100%
    ),
    linear-gradient(
      to right,
      ${semanticColor.bgBtn.inactive.default} 0%,
      ${semanticColor.bgBtn.inactive.default} 100%
    )
  `;
  }};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 4px, 100% 2px;
  height: 4px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${semanticColor.bg.primary};
    cursor: pointer;
    border: none;
    box-shadow: 0 0 0 3px white, 0 0 0 4px ${semanticColor.bg.default}33;
  }

  &::-moz-range-thumb {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${semanticColor.bg.primary};
    cursor: pointer;
    border: none;
  }

  &::-ms-thumb {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: ${semanticColor.bg.primary};
    cursor: pointer;
    border: none;
  }

  &::-moz-range-track {
    height: 2px;
    background: transparent;
    cursor: pointer;
  }
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;
