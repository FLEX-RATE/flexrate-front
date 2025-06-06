'use client';

import { Skeleton, Spacing } from '@/components/Skeleton/Skeleton.style';
import styled from '@emotion/styled';

const Container = styled.div`
  margin-top: 24px;
  width: calc(100% - 22px);
`;

export const ReviewResultSkeleton = () => {
  return (
    <Container>
      <Skeleton width="100%" height={50} />
      <Spacing direction="vertical" size={16} />

      <Skeleton width="100%" height={50} />
      <Spacing direction="vertical" size={12} />
      <Skeleton width="100%" height={50} />
      <Spacing direction="vertical" size={12} />
      <Skeleton width="100%" height={50} />
      <Spacing direction="vertical" size={12} />
      <Skeleton width="100%" height={50} />
      <Spacing direction="vertical" size={12} />
      <Skeleton width="100%" height={80} />
      <Spacing direction="vertical" size={24} />

      <Skeleton width="20%" height={20} />
      <Spacing direction="vertical" size={8} />
      <Skeleton width="20%" height={20} />
      <Spacing direction="vertical" size={8} />
      <Skeleton width="40%" height={20} />
      <Spacing direction="vertical" size={14} />
      <Skeleton width="100%" height={100} />
    </Container>
  );
};
