import styled from 'styled-components';

export const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--semantic-bg-default); // 배경 색상 시스템 변수
`;

export const Header = styled.header`
  font-size: var(--pretendard-head1-b-24-font-size);
  font-weight: var(--pretendard-head1-b-24-font-weight);
  font-family: var(--pretendard-head1-b-24-font-family);
  line-height: var(--pretendard-head1-b-24-line-height);
  color: var(--semantic-text-normal-primary);
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: var(--pretendard-body2-sb-14-font-size);
  font-weight: var(--pretendard-body2-sb-14-font-weight);
  font-family: var(--pretendard-body2-sb-14-font-family);
  line-height: var(--pretendard-body2-sb-14-line-height);
  color: var(--semantic-text-normal-sub1);

  input {
    margin-right: 0.5rem;
  }
`;

export const Button = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 1rem;
  background-color: var(--semantic-bgbtn-active-primary);
  color: var(--semantic-text-normal-onprimary);
  border-radius: 0.375rem;
