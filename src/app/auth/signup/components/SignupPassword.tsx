// 회원가입 비밀번호 설정 컴포넌트
// @author 윤영찬
// @since 2025-05-13

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Button/Button'
import TextField from '@/components/TextField/TextField'
import { authSchemas } from '@/schemas/auth.schema'

import {
  Container,
  Title,
  FormContainer,
  BtnContainer,
} from './SignupPassword.style'

interface SignupPasswordProps {
  email: string
  onNext: (pw: string) => void
}

type FormData = z.infer<typeof authSchemas.passwordOnly>

export const SignupPassword = ({ email, onNext }: SignupPasswordProps) => {
  const {
    control,
    trigger,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(authSchemas.passwordOnly),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  })

  const password = watch('password')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await trigger()
    if (!isValid) return

    onNext(password)
  }

  return (
    <Container>
      <Title>비밀번호 설정</Title>

      <FormContainer onSubmit={handleSubmit}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              value={field.value}
              onChange={field.onChange}
              isError={!!errors.password}
              rightContent={{ type: 'DELETE', onClick: () => field.onChange('') }}
            >
              <TextField.TextFieldBox
                type="password"
                placeholder="비밀번호 입력"
              />
              <TextField.ErrorText message={errors.password?.message ?? ''} />
            </TextField>
          )}
        />

        <TextField value={email} onChange={() => {}} isDisabled>
          <TextField.TextFieldBox
            type="text"
            placeholder="이메일"
            // readOnly 제거: 타입에 없으므로 오류 발생
          />
        </TextField>

        <BtnContainer>
          <Button
            type="submit"
            text="다음으로"
            disabled={!dirtyFields.password || !!errors.password}
          />
        </BtnContainer>
      </FormContainer>
    </Container>
  )
}

export default SignupPassword
