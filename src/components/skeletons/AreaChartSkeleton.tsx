'use client';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const SkeletonBox = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f4f4f4 25%, #eaeaea 50%, #f4f4f4 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;

const ChartSkeleton = () => <SkeletonBox />;

export default ChartSkeleton;
