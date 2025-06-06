'use client';

import styled from '@emotion/styled';
import { Skeleton, Spacing } from '@/components/Skeleton/Skeleton.style';

const Container = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const MyPageSkeleton = () => {
  return (
    <Container>
      <Skeleton width="100%" height={56} />
      <Spacing direction="vertical" size={24} />

      <Section>
        <Skeleton width="30%" height={24} />
        <Spacing direction="vertical" size={16} />
        <Skeleton width="100%" height={48} />
        <Spacing direction="vertical" size={12} />
        <Skeleton width="100%" height={48} />
      </Section>

      <Section>
        <Skeleton width="30%" height={24} />
        <Spacing direction="vertical" size={16} />
        <Skeleton width="100%" height={100} />
      </Section>

      <Skeleton width="100%" height={48} />
    </Container>
  );
};

export default MyPageSkeleton;
