import styled from '@emotion/styled';

export const Skeleton = styled.div<{ width: string | number; height: string | number }>`
  background-color: #e0e0e0;
  border-radius: 6px;
  animation: shimmer 1.5s infinite linear;
  background-image: linear-gradient(90deg, #e0e0e0 0px, #f0f0f0 40px, #e0e0e0 80px);
  background-size: 600px 100%;
  background-repeat: no-repeat;

  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '1rem')};

  @keyframes shimmer {
    0% {
      background-position: -600px 0;
    }
    100% {
      background-position: 600px 0;
    }
  }
`;

export const Spacing = styled.div<{ direction: 'horizontal' | 'vertical'; size: number }>`
  width: ${({ direction, size }) => (direction === 'horizontal' ? `${size}px` : 'auto')};
  height: ${({ direction, size }) => (direction === 'vertical' ? `${size}px` : 'auto')};
`;
