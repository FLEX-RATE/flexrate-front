import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Container = styled.div`
  width: 100%;
  height: 640px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 44px 24px;
`;

export const Title = styled.div`
  margin-top: 60px;
  ${typoStyleMap['head1']};
  text-align: center;
  color: ${semanticColor.text.normal.primary};
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 43px;
  left: 22px;
  height: 0px;
`;

export const BackButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: ${semanticColor.text.normal.sub2};
  ${typoStyleMap['body2_m']};
  cursor: pointer;

  transform: translateY(10px);

`;