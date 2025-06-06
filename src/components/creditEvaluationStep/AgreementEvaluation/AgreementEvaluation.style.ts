import styled from '@emotion/styled';

export const Wrapper = styled.div`
  height: 100svh;
  overflow-y: auto;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  margin-top: 32px;
`;

export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;
