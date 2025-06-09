import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  padding: 12px 22px;
  ${typoStyleMap['head1']};
  color: ${semanticColor.text.normal.primary};
`;

export const BottomSheetHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubText = styled.div`
  cursor: pointer;
  ${typoStyleMap['caption1_m']}
  color: ${semanticColor.text.normal.sub2};
`;

export const Question = styled.div`
  padding: 12px 0px 12px 0px;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const BtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

export const SheetBtn = styled.button`
  cursor: pointer;
  width: 100%;
  padding: 10px 0px;
  ${typoStyleMap['body1_sb']};
  border-radius: 12px;
  border: 1px solid ${semanticColor.border.active.sub3};
  background: ${semanticColor.bgBtn.active.wt};
  color: ${semanticColor.text.normal.sub1};
  display: flex;
  justify-content: center;
`;

export const BtnContainer = styled.div`
  width: 140px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
`;
