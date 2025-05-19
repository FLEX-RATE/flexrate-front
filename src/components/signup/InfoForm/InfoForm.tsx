'use client'

import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Button/Button'
import TextField from '@/components/TextField/TextField'

import { Container, Title, FormContainer, BtnContainer } from './InfoFrom.style'

export type LoginSelectorProps = {
  onNext: (info: { gender: string; birthDate: string; name: string }) => void
}

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  gender: z.enum(['MALE', 'FEMALE'], { required_error: '성별을 선택해주세요.' }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일 형식이 올바르지 않습니다.'),
})

type FormData = z.infer<typeof schema>

const InfoForm = ({ onNext }: LoginSelectorProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      gender: 'FEMALE',
      birthDate: '',
    },
  })

  const onSubmit = (data: FormData) => {
    onNext(data)
  }

  return (
    <Container>
      <Title>
        반가워요!
        <br />
        개인 정보를 입력해 주세요
      </Title>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        {/* 이름 입력 */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField value={field.value} onChange={field.onChange} isError={!!errors.name}>
              <TextField.TextFieldBox placeholder="이름 입력" />
              <TextField.ErrorText message={errors.name?.message ?? ''} />
            </TextField>
          )}
        />

        {/* 성별 선택 버튼 */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => field.onChange('FEMALE')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 8,
                  border: '1.5px solid',
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor: field.value === 'FEMALE' ? '#3B82F6' : '#FFF',
                  color: field.value === 'FEMALE' ? '#FFF' : '#222',
                  borderColor: field.value === 'FEMALE' ? '#3B82F6' : '#D1D5DB',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                여성
              </button>
              <button
                type="button"
                onClick={() => field.onChange('MALE')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 8,
                  border: '1.5px solid',
                  fontSize: 14,
                  fontWeight: 500,
                  backgroundColor: field.value === 'MALE' ? '#3B82F6' : '#FFF',
                  color: field.value === 'MALE' ? '#FFF' : '#222',
                  borderColor: field.value === 'MALE' ? '#3B82F6' : '#D1D5DB',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                남성
              </button>
            </div>
          )}
        />
        {errors.gender && (
          <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{errors.gender.message}</p>
        )}

        {/* 생년월일 입력 */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <TextField value={field.value} onChange={field.onChange} isError={!!errors.birthDate}>
              <TextField.TextFieldBox type="date" placeholder="생년월일 (YYYY-MM-DD)" />
              <TextField.ErrorText message={errors.birthDate?.message ?? ''} />
            </TextField>
          )}
        />

        <BtnContainer>
          <Button type="submit" text="다음" disabled={!isValid} />
        </BtnContainer>
      </FormContainer>
    </Container>
  )
}

export default InfoForm
