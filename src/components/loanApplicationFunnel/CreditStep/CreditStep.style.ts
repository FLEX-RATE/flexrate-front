import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const MainContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 11px;
  align-items: flex-start;
  padding: 11px 0px 80px 0px;
`;

export const CreditInformationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const SubTitle = styled.div`
  margin-top: 10px 0px;
  padding: 12px 0px;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;

export const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`;

export const BtnFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const BtnSectionTitle = styled.div`
  ${typoStyleMap['body2_m']};
  margin-bottom: 1.5px;
  margin-left: 4px;
  color: ${semanticColor.text.normal.sub1};
`;
