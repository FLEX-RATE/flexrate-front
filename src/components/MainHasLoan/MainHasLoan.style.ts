import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';

export const SliderWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const SlideContainer = styled.div<{ index: number }>`
  display: flex;
  transition: transform 0.4s ease-in-out;
  transform: translateX(${(props) => -props.index * 100}%);
`;

export const Slide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  box-sizing: border-box;
`;

export const IndicatorDot = styled.div<{ active: boolean }>`
  width: ${(props) => (props.active ? '28px' : '4px')};
  height: 4px;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.active ? semanticColor.bgBtn.active.primary : semanticColor.bgBtn.inactive.default};
  transition: all 0.3s ease;
`;

export const SlideButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
`;

export const ArrowWrapper = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  transition: opacity 0.2s;
`;

export const IndicatorWrapperWithButtons = styled.div`
  position: sticky;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  position: relative;
`;

export const IndicatorWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;
