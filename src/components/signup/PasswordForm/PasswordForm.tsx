'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';

import { Container, FormContainer, BtnContainer } from './../EmailForm/EmailForm.style';
import { BottomSheetBtnContainer, Title } from './PasswordForm.style';

const schema = z
  .object({
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/[a-zA-Z]/, '영문자를 포함해야 합니다.')
      .regex(/[0-9]/, '숫자를 포함해야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

interface PasswordFormProps {
  email: string;
  onNext: (data: { password: string }) => void;
}

const PasswordForm = ({ email, onNext }: PasswordFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const tempPassword = useRef('');
  const password = watch('password');

  useEffect(() => {
    const check = async () => {
      const valid = await trigger('password');
      if (valid) setShowConfirm(true);
      else setShowConfirm(false);
    };
    check();
  }, [password, trigger]);

  const onSubmit = (data: FormData) => {
    tempPassword.current = data.password;
    handleSelectMethod();
  };

  const handleSelectMethod = () => {
      onNext({ password: tempPassword.current });
  };

  return (
    <Container>
      <Title>비밀번호를 입력해주세요</Title>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              value={field.value}
              onChange={field.onChange}
              isError={!!errors.password}
              rightContent={{
                type: 'DELETE',
                onClick: () => field.onChange(''),
              }}
            >
              <TextField.TextFieldBox type="password" placeholder="비밀번호 입력" />
              <TextField.ErrorText message={errors.password?.message ?? ''} />
            </TextField>
          )}
        />

        {showConfirm && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  isError={!!errors.confirmPassword}
                  rightContent={{
                    type: 'DELETE',
                    onClick: () => field.onChange(''),
                  }}
                >
                  <TextField.TextFieldBox type="password" placeholder="비밀번호 확인" />
                  <TextField.ErrorText message={errors.confirmPassword?.message ?? ''} />
                </TextField>
              )}
            />
          </motion.div>
        )}

        <BtnContainer>
          <Button type="submit" text="다음으로" disabled={!isValid} />
        </BtnContainer>
      </FormContainer>
    </Container>
  );
};

export default PasswordForm;
