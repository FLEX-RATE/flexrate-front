import styled from '@emotion/styled';

import { semanticColor } from '@/styles/colors';
import { typoStyleMap } from '@/styles/typos';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 16px;
  background: ${semanticColor.bg.primary};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  ${typoStyleMap['head1']};
  color: ${semanticColor.text.normal.primary};
  margin-bottom: 16px;
`;

export const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  max-width: 280px;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  ${typoStyleMap['body1_sb']};
  color: ${({ disabled }) =>
    disabled ? semanticColor.text.normal.sub2 : semanticColor.text.normal.onPrimary};
  background: ${({ disabled }) =>
    disabled ? semanticColor.bgBtn.inactive.default : semanticColor.bgBtn.active.primary};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ disabled }) =>
      disabled ? semanticColor.bgBtn.inactive.default : semanticColor.bgBtn.active.tertiary};
  }
`;

export const ErrorText = styled.div`
  margin-top: 12px;
  ${typoStyleMap['body2_m']};
  color: ${semanticColor.text.state.textError};
`;

export const SuccessText = styled.div`
  ${typoStyleMap['body1_sb']};
  color: ${semanticColor.text.state.textSuccess};
`;
