import styled from '@emotion/styled';

import { primitiveColor, semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MainTitleContainer = styled.div`
  padding: 0px 0px 12px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

export const Title2 = styled.div<{ isStrong?: boolean }>`
  ${typoStyleMap['title2']};
  color: ${({ isStrong }) =>
    isStrong ? semanticColor.text.normal.accent : semanticColor.text.normal.primary};
  display: flex;
  gap: 6px;
`;

export const Body2 = styled.span`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
`;

export const Body3 = styled.span`
  ${typoStyleMap['body1_sb']};
  color: ${semanticColor.text.normal.accent};
`;

export const UserProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 16px 20px;
  border-radius: 15px;
  background-color: ${primitiveColor.background.cardBg};
`;

export const ProductTitle = styled.div`
  ${typoStyleMap['body2_sb']}
  color: ${semanticColor.text.normal.sub2};
`;

export const UserProductContentContainer = styled.div`
  display: flex;
  gap: 13px;
`;

export const Tags = styled.div`
  display: flex;
  gap: 4px;
`;
export const SmallTag = styled.div`
  border-radius: 15px;
  background-color: ${primitiveColor.yellow};
  padding: 4px 8px 0px 8px;
  ${typoStyleMap['caption3_b']}
`;

export const BgContainer = styled.div<{ color: string }>`
  padding: 16px 22px 30px 22px;
  background-color: ${({ color }) =>
    color === 'gray' ? primitiveColor.background.cardBg : semanticColor.bg.default};
`;

export const CardFlexContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 15px;
  margin-bottom: 50px;
`;

export const Card = styled.div<{ color?: string }>`
  padding: 18px;
  width: 100%;
  height: 162px;
  background-color: ${({ color }) =>
    color === 'gray' ? primitiveColor.background.cardBg : semanticColor.bg.default};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CardTitle = styled.div`
  ${typoStyleMap['display']};
  color: ${semanticColor.text.normal.accent};
`;

export const SmallTitle = styled.span<{ $isStrong?: boolean }>`
  ${typoStyleMap['body1_sb']};
  color: ${({ $isStrong }) =>
    $isStrong ? semanticColor.text.normal.accent : semanticColor.text.normal.primary};
`;

export const CardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SubTitle = styled.div`
  ${typoStyleMap['body2_eb']};
  color: ${semanticColor.text.normal.primary};
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const Description = styled.div<{ type: string }>`
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  ${typoStyleMap['caption1_m']};
  color: ${({ type }) =>
    type === 'sub2' ? semanticColor.text.normal.sub2 : semanticColor.text.normal.sub3};
`;

export const PercentageText = styled.span`
  ${typoStyleMap['body2_eb']};
  color: ${primitiveColor.green};
`;
