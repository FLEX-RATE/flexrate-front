'use client';

import { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import Image from 'next/image';

import { characterList } from '@/constants/auth.constant';

const CharacterLoading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % characterList.length;
        return next;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <Image
        key={index}
        src={characterList[index].src}
        alt="로딩 캐릭터"
        width={160}
        height={160}
        priority
      />
    </Wrapper>
  );
};

export default CharacterLoading;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100svh;
  margin-bottom: 50px;
`;
