import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Wrapper = styled.div`
  height: 100svh;
  overflow-y: auto;
`;

export const MainContainer = styled.div`
  position: relative;
  margin: 10% auto 40px auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 11px 11px 80px 11px;
`;

export const Title = styled.div`
  ${typoStyleMap['head1']};
  color: ${semanticColor.text.normal.primary};
  margin: 12px 6px;
`;
