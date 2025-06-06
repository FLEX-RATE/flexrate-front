'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 150px;
  background: linear-gradient(180deg, #fff 0%, #d2ebff 100%);
`;

export const IntroduceContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding: 0px 22px;
  justify-content: center;
  align-items: center;
`;
export const IntroduceTextContainer = styled.div`
  display: flex;
  margin: 20px 0px 5px 0px;
  padding: 12px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const SubTitle = styled.div`
  margin-top: 2px;
  ${typoStyleMap['body2_m']}
  color: ${semanticColor.text.normal.sub2};
`;

export const Icon3DContainer = styled.div`
  position: relative;
  width: 169px;
  height: 169px;
`;

export const MainImage3D = styled(motion.div)`
  position: absolute;
`;

export const ContentBox = styled(motion.div)`
  display: flex;
  width: calc(100% - 44px);
  margin-top: 12px;
  padding: 8px 10px;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: ${semanticColor.bg.default};
  box-shadow: 0px 4px 12px 4px rgba(0, 82, 147, 0.2);
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 12px 8px;
  gap: 4px;
  align-items: center;
  border-bottom: 1px solid ${semanticColor.border.inactive.default};

  &:last-child {
    border-bottom: none;
  }
`;

export const ContentTitle = styled.div`
  ${typoStyleMap['caption1_m']};
  color: ${semanticColor.text.normal.sub2};
`;

export const ContentSubTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContentSubTextTitle = styled.div`
  ${typoStyleMap['body2_sb']};
  color: ${semanticColor.text.normal.sub1};
`;

export const ContentSubTextContent = styled.div`
  ${typoStyleMap['caption2_r']};
  color: ${semanticColor.text.normal.sub3};
`;

export const Spacing = styled.div`
  height: 9px;
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;
