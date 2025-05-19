'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendEmailVerificationCode, verifyEmailCode } from '@/apis/auth';
import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { authSchemas } from '@/schemas/auth.schema';

import { BtnContainer, Container, FormContainer, Title } from './EmailForm.style';

type FormData = z.infer<typeof authSchemas.emailWithCode>;

const EmailForm = ({ onNext }: { onNext: (email: string) => void }) => {
  const [codeSent, setCodeSent] = useState(false); // 인증 코드 요청 여부

  const {
    control,
    watch,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(authSchemas.emailWithCode),
    mode: 'onChange',
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const email = watch('email');
  const code = watch('code');

  // 인증 코드 요청 핸들러
  const handleRequestCode = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    try {
      await sendEmailVerificationCode({ email });
      setCodeSent(true); // 코드 입력 UI 표시
    } catch (error) {
      console.error(error);
      alert('인증메일 발송에 실패했습니다.');
    }
  };

  // 인증 확인 핸들러
  const handleVerify = async () => {
    const isCodeValid = await trigger('code');
    if (!isCodeValid) return;

    try {
      await verifyEmailCode({ email, code });
      onNext(email); // 인증 성공 시 다음 단계로 이동
    } catch (error) {
      console.error(error);
      alert('인증번호가 틀렸거나 만료되었습니다.');
    }
  };

  return (
    <Container>
      <Title>
        반가워요!
        <br />
        이메일 인증을 시작할게요
      </Title>

      <FormContainer>
        {/* 인증번호 입력 영역 (코드 요청 후 노출) */}
        {codeSent && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  value={field.value}
                  onChange={field.onChange}
                  isError={!!errors.code}
                  rightContent={{ type: 'DELETE', onClick: () => field.onChange('') }}
                >
                  <TextField.TextFieldBox type="text" placeholder="인증번호 입력" />
                  <TextField.ErrorText message={errors.code?.message ?? ''} />
                </TextField>
              )}
            />
          </motion.div>
        )}

        {/* 이메일 입력 필드 */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              value={field.value}
              onChange={field.onChange}
              isError={!!errors.email}
              rightContent={{ type: 'DELETE', onClick: () => field.onChange('') }}
            >
              <TextField.TextFieldBox type="email" placeholder="이메일 주소 입력" />
              <TextField.ErrorText message={errors.email?.message ?? ''} />
            </TextField>
          )}
        />

        <BtnContainer>
          {/* 인증 요청/확인 버튼 */}
          {!codeSent ? (
            <Button
              type="button"
              text="인증요청하기"
              onClick={handleRequestCode}
              disabled={!dirtyFields.email || !!errors.email}
            />
          ) : (
            <Button
              type="button"
              text="인증하기"
              onClick={handleVerify}
              disabled={!code || !!errors.code}
            />
          )}
        </BtnContainer>
      </FormContainer>
    </Container>
  );
};

export default EmailForm;
