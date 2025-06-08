'use client';

import styled from '@emotion/styled';

import { Skeleton, Spacing } from '@/components/Skeleton/Skeleton.style';

const Container = styled.div`
  padding: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const MainFirstPageSkeleton = () => {
  return (
    <Container>
      <Skeleton width="30%" height={40} />
      <Spacing direction="vertical" size={8} />
      <Skeleton width="70%" height={26} />
      <Spacing direction="vertical" size={30} />

      <Section>
        <Skeleton width="100%" height={64} />
        <Spacing direction="vertical" size={16} />
        <Skeleton width="100%" height={64} />
        <Spacing direction="vertical" size={16} />
        <Skeleton width="100%" height={150} />
      </Section>

      <Skeleton width="100%" height={80} />
    </Container>
  );
};

export default MainFirstPageSkeleton;
