'use client'

import React, { useState } from 'react'

import Button from '@/components/Button/Button'
import AddPinLogin from '@/components/login/PinLogin/AddPinLogin/AddPinLogin'  // AddPinLogin 경로 맞게 조정
import PinEmailForm from '@/components/login/PinLogin/PinEmailForm/PinEmailForm'

import { BackButton, BtnContainer, Container, Title } from './PinRegister.style'


interface PinRegisterPageProps {
  onBack: () => void;  // onBack 함수가 필수로 전달되어야 합니다.
}

const PinRegisterPage = ({ onBack }: PinRegisterPageProps) => {

  const [emailStatus, setEmailStatus] = useState<string>('')

  if (emailStatus === 'pending') {
    return (
      <PinEmailForm
        onVerified={(emailFromForm: string) => {
          alert(`이메일 인증 완료: ${emailFromForm}`)
          setEmailStatus(emailFromForm)
        }}
        // onCancel={() => setEmailStatus('')}
      />
    )
  }

  if (emailStatus && emailStatus !== 'pending') {
    // 인증 완료된 이메일이 있으면 PIN 등록 화면 보여주기
    return (
      <AddPinLogin
        email={emailStatus}
        onComplete={() => {
          alert('PIN 등록 완료!')
          setEmailStatus('') // 완료 후 초기화하거나 다른 화면으로 이동 처리 가능
          onBack() // 필요시 뒤로가기 콜백 호출
        }}
      />
    )
  }

  // 초기 화면: 등록하기 버튼 및 뒤로가기 버튼
  return (
    <Container>
      <Title>아직 간편 비밀번호가 없어요</Title>
      <BtnContainer>
        <Button
          text="등록하기"
          onClick={() => setEmailStatus('pending')}
        />
        <BackButton
          type="button"
          onClick={onBack}
        >
          다른 로그인 방법 &gt;
        </BackButton>
      </BtnContainer>
    </Container>
  )
}

export default PinRegisterPage
