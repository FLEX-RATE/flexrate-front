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

// form 태그 역할, 내부 아이템은 세로로 배치, gap 12px, margin-top 34px
export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  padding: 0 22px;
  gap: 12px;
`;

// 버튼 컨테이너 - 화면 하단 고정, 좌우 패딩 22px를 뺀 너비, margin-bottom 50px
export const BtnContainer = styled.div`
  width: calc(100% - 44px);
  position: absolute;
  bottom: 0;
  margin-bottom: 50px;
`;

// 성별 선택 버튼 그룹
export const GenderButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

// 성별 버튼 스타일
export const GenderButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  border: 1.5px solid;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: ${({ selected }) => (selected ? '#3B82F6' : '#FFFFFF')};
  color: ${({ selected }) => (selected ? '#FFFFFF' : '#222222')};
  border-color: ${({ selected }) => (selected ? '#3B82F6' : '#D1D5DB')};

  &:hover {
    border-color: ${({ selected }) => (selected ? '#3B82F6' : '#9CA3AF')};
  }
`;

// 에러 텍스트
export const ErrorText = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;
