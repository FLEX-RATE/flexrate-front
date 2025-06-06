'use client';

import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

const NotFound = () => {
  const router = useRouter();

  return (
    <Container>
      <Title>해당 페이지에 접근할 수 없습니다</Title>
      <Image src={'/icons/webeeX.svg'} alt="접근하지 못해서 슬픈 위비" width={170} height={170} />
      <BtnContainer>
        <Button varient="PRIMARY" text="메인페이지로 이동하기" onClick={() => router.push('/')} />
      </BtnContainer>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 86vh;
`;

const Title = styled.div`
  margin: 0px 0px 80px 0px;
  ${typoStyleMap['head1']};
  color: ${semanticColor.text.normal.primary};
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;
