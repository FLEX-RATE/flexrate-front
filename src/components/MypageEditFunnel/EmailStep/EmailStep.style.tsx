import styled from '@emotion/styled';

export const FormContainer = styled.form`
  position: relative;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const BtnWrapper = styled.div`
  width: calc(100% - 22px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;

export const BtnContainer = styled.div`
  width: calc(100% - 22px);
`;
