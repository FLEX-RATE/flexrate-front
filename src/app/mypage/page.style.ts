import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Wrapper = styled.div`
  height: 100svh;
  overflow-y: auto;
`;

export const MainContainer = styled.div`
  position: relative;
  margin: 0 auto 40px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 11px 11px 80px 11px;
`;

export const SubContainer = styled.div`
  margin-bottom: 12px;
`;

export const SubTitle = styled.div`
  margin: 12px 0;
  ${typoStyleMap['title3']};
  color: ${semanticColor.text.normal.primary};
`;

export const TableItem = styled.span`
  padding: 18px 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid ${semanticColor.border.inactive.default};
  min-width: fit-content;

  &:last-child {
    border: none;
  }
`;

export const TableItemKey = styled.span`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
  min-width: fit-content;
`;

export const TableItemValue = styled.span<{ $isStrong?: boolean }>`
  ${typoStyleMap['body2_b']};
  color: ${({ $isStrong }) =>
    $isStrong ? semanticColor.text.normal.accent : semanticColor.text.normal.sub2};
  min-width: fit-content;
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;

export const TitleContainer = styled.div`
  padding: 12px 22px;
`;

export const Title = styled.div`
  ${typoStyleMap['title2']};
  color: ${semanticColor.text.normal.primary};
`;

export const SubText = styled.div`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
`;

export const ModalBtnContainer = styled.div`
  padding: 0px 22px;
  display: flex;
  gap: 8px;
  margin-top: 70px;
`;
