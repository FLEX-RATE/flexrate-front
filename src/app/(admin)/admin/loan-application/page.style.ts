import styled from '@emotion/styled';

import { semanticColor } from "@/styles/colors";
import { typoStyleMap } from "@/styles/typos";

export const PageContainer = styled.div`
    padding: 30px;
    width: 100%;
`;

export const ContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const FilterRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const FilterLabel = styled.p`
    margin: 0;
    font-size: 1rem;
    color: #3c3c3c;
    min-width: fit-content;
`;

export const ModalColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  border-bottom: 1px solid ${semanticColor.border.inactive.default};
`;

export const ModalTitle = styled.div`
  padding: 12px 0px 12px 0px;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const ModalSubTitle = styled.div`
  padding: 12px 0px 8px 0px;
  ${typoStyleMap['body2_b']};
  color: ${semanticColor.text.normal.sub1};
`;

export const ModalInfoContainer = styled.div`
  min-width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding-bottom: 1rem;
  
`;

export const ModalInfoKeyColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 80px;
  gap: 0.3rem;
`;

export const ModalInfoValueColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  gap: 0.3rem;
`;

export const InfoLabel = styled.p`
  color: ${semanticColor.text.normal.sub2};
  margin: 0;
`;

export const InfoValue = styled.p`
  color: ${semanticColor.text.normal.sub2};
  margin: 0;
`;

export const InfoBottomText = styled.div`
  text-align: center;
    color: ${semanticColor.text.normal.sub3};
    padding: 1rem 0 2rem 0;
`;

export const ErrorInfo = styled.div`
  color: ${semanticColor.text.state.textError};
  ${typoStyleMap['caption1_m']};
  padding-left: 0.5rem;
  margin-top: 0.2rem;
`;

export const DivideMargin = styled.div`
  margin: 1rem 0;
  width: 100%;
`;