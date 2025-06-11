'use client';

import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';
import Image from 'next/image';

import Button from '@/components/Button/Button';
import { characterList, ConsumptionTypeKey } from '@/constants/auth.constant';
import { useConsumptionType } from '@/hooks/useConsumptionType';
import { characterMap } from '@/utils/signup.util';

import { BtnContainer, Container, Title } from '../EmailForm/EmailForm.style';

import { CharacterContainer, Description, ResultCard, Tag } from './ConsumptionResult.style';

interface ConsumptionResultProps {
  onNext: (consumptionType: string) => void;
  userName: string;
}

const ConsumptionResult = ({ onNext, userName }: ConsumptionResultProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const { data, isLoading } = useConsumptionType();

  const finalKey = data as ConsumptionTypeKey | undefined;
  const finalCharacter = finalKey ? characterMap[finalKey] : undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % characterList.length);
    }, 300);

    const timeout = setTimeout(() => {
      setAnimationDone(true);
      clearInterval(interval);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const showResult = animationDone && !isLoading && !!finalCharacter;

  return (
    <Container data-testid="consumption-result">
      <Title>{userName}님의 소비 성향은...</Title>
      <CharacterContainer>
        {!showResult ? (
          <ResultCard>
            <Image
              src={characterList[currentIndex].src}
              alt="캐릭터 로딩"
              width={160}
              height={160}
            />
          </ResultCard>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultCard>
              <Image src={finalCharacter.src} alt="최종 캐릭터" width={120} height={120} />
              <Tag>{finalCharacter.name}</Tag>
              <Description>{finalCharacter.description}</Description>
            </ResultCard>
          </motion.div>
        )}
        {showResult && (
          <BtnContainer>
            <Button text="다음으로" size="XL" onClick={() => onNext(finalCharacter.key)} />
          </BtnContainer>
        )}
      </CharacterContainer>
    </Container>
  );
};

export default ConsumptionResult;
