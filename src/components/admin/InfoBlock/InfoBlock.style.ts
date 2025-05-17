import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shimmer = keyframes`
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
`;

export const StyledInfoBlock = styled.div`
  width: 100%;
  padding: 20px 30px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SkeletonInfoBox = styled.div`
  width: 100%;
  padding: 20px 30px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #f9f9f9;
  position: relative;
  overflow: hidden;
  min-height: 120px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 468px 100%;
    animation: ${shimmer} 1.8s infinite ease-in-out;
  }
`;

export const SectionTitle = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid #1677ff;
  color: #1677ff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  width: fit-content;
  position: relative;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InfoGrid = styled.div<{ columns?: number }>`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  ${({ columns }) =>
    columns === 1 &&
    `
    flex-direction: column;
  `}
`;

export const InfoLoanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-right: 10px;
`;

export const InfoLoanItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #2f3439;
  margin-right: 10px;
`;

export const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;
