// 회원가입 과정 중 사용자 인증 방법을 선택하는 컴포넌트
// @author 윤영찬
// @since 2025-05-13

'use client'

import React from 'react'

import { SignupContextMap } from '../types/signup'

import {
  Container,
  Title,
  ButtonGroup,
  SelectButton,
} from './SignupMethodSelector.style'

interface SignupMethodSelectorProps {
  onSelect: (method: SignupContextMap['method']['method']) => void
}

export const SignupMethodSelector = ({ onSelect }: SignupMethodSelectorProps) => {
  return (
    <Container>
      <Title>어떤 방법으로 로그인할까요?</Title>

      <ButtonGroup>
        <SelectButton type="button" onClick={() => onSelect('pin')}>
          간편 비밀번호
        </SelectButton>
        <SelectButton type="button" onClick={() => onSelect('faceid')}>
          지문
        </SelectButton>
        <SelectButton type="button" onClick={() => onSelect('pin')}>
          일반 로그인
        </SelectButton>
      </ButtonGroup>
    </Container>
  )
}

export default SignupMethodSelector
