import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${semanticColor.bg.default};
  z-index: 10;
`;

export const Wrapper = styled.div`
  height: 100svh;
  overflow-y: auto;
`;

export const JobFlexStartContainer = styled.div`
  margin: 0 auto;
  width: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 11px;
`;

export const Title = styled.div`
  ${typoStyleMap['title2']};
  color: ${semanticColor.text.normal.primary};
  margin-bottom: 5px;
`;

export const Name = styled.span`
  color: ${semanticColor.text.normal.accent};
`;

export const Description = styled.div`
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.normal.sub2};
  white-space: 'pre-line';
`;

export const Container = styled.div`
  margin: 0 auto;
  width: calc(100% - 22px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
