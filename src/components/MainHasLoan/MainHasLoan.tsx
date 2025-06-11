import { useState } from 'react';

import Image from 'next/image';

import { useInitUser } from '@/hooks/useInitUser';
import { useSlideTouch } from '@/hooks/useSlideTouch';
import { useUserStore } from '@/stores/userStore';

import FirstPage from './FirstPage/FirstPage';
import {
  ArrowWrapper,
  IndicatorDot,
  IndicatorWrapper,
  IndicatorWrapperWithButtons,
  Slide,
  SlideContainer,
  SliderWrapper,
} from './MainHasLoan.style';
import SecondPage from './SecondPage/SecondPage';

const MainHasLoan = () => {
  useInitUser();
  const user = useUserStore((state) => state.user);
  const [index, setIndex] = useState(0);
  const totalSlides = 2;
  const {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  } = useSlideTouch(index, totalSlides, setIndex);

  return (
    <SliderWrapper data-testid="main-has-loan">
      <IndicatorWrapperWithButtons>
        <ArrowWrapper disabled={index === 0} onClick={() => index > 0 && setIndex(index - 1)}>
          <Image src="/icons/left_slide_arrow.svg" alt="왼쪽 화살표" width={3.234} height={5.805} />
        </ArrowWrapper>

        <IndicatorWrapper>
          {[...Array(totalSlides)].map((_, i) => (
            <IndicatorDot key={i} active={i === index} onClick={() => setIndex(i)} />
          ))}
        </IndicatorWrapper>

        <ArrowWrapper
          disabled={index === totalSlides - 1}
          onClick={() => index < totalSlides - 1 && setIndex(index + 1)}
        >
          <Image
            src="/icons/right_slide_arrow.svg"
            alt="오른쪽 화살표"
            width={3.234}
            height={5.805}
          />
        </ArrowWrapper>
      </IndicatorWrapperWithButtons>

      <SlideContainer
        index={index}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <Slide>
          <FirstPage user={user} />
        </Slide>
        <Slide>
          <SecondPage />
        </Slide>
      </SlideContainer>
    </SliderWrapper>
  );
};

export default MainHasLoan;
