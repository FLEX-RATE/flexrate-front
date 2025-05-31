'use client'

import { useRouter } from 'next/navigation'

import Header from '@/components/Header/Header'
import PinRegisterPage from '@/components/login/PinLogin/PinRegisterPage/PinRegisterPage'

const RegisterPage = () => {
  const router = useRouter()
  const handleBack = () => router.back()

  return (
    <>
      <Header backIcon/>
      <PinRegisterPage onBack={handleBack} />
    </>
  )
}

export default RegisterPage
