import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const BannerContainer = styled.div<{ $borderNone?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border: ${({ $borderNone }) =>
    $borderNone ? 'none' : `1px solid ${semanticColor.border.inactive.default}`};
  padding: 9px 21px;
  border-radius: 15px;
  min-width: fit-content;
  background: ${semanticColor.bg.default};
`;

export const BannerContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BannerTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

interface BannerLabelProps {
  $bgColor: string;
  $color: string;
}

export const BannerLabel = styled.div<BannerLabelProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  padding: 8px 12px;
  border-radius: 14px;
  ${typoStyleMap['body2_sb']}
  margin-right: 10px;
  min-width: fit-content;
`;

export const BannerDesc = styled.p`
  ${typoStyleMap['body2_eb']}
  margin: 0;
  color: ${semanticColor.text.normal.primary};
  min-width: fit-content;
`;

export const ReportBtn = styled.div`
  cursor: pointer;
  width: 100%;
  padding: 12px 0px 9px 0px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${semanticColor.border.inactive.default};
`;

export const ReportTitle = styled.div`
  ${typoStyleMap['caption1_m']};
  color: ${semanticColor.text.normal.sub2};
`;
