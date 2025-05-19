'use client'

import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import Button from '@/components/Button/Button'
import TextField from '@/components/TextField/TextField'

export type LoginSelectorProps = {
  onNext: (info: { gender: string; birthDate: string; name: string }) => void
}

// 스키마 정의
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
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

      {/* 성별 선택 */}
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="space-y-1">
            <select {...field} className="w-full p-2 border rounded text-sm">
              <option value="MALE">남성</option>
              <option value="FEMALE">여성</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender.message}</p>
            )}
          </div>
        )}
      />

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

      {/* 제출 버튼 */}
      <Button type="submit" text="다음" disabled={!isValid} />
    </form>
  )
}

export default InfoForm
