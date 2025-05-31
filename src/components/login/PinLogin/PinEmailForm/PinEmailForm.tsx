'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useVerifyEmailCode } from '@/hooks/useVerifyEmailCode';
import { authSchemas } from '@/schemas/auth.schema';

import { BtnContainer, Container, FormContainer, Title } from './PinEmailForm.style';

type FormData = z.infer<typeof authSchemas.emailWithCode>;

const PinEmailForm = ({ onVerified }: { onVerified: (email: string) => void }) => {
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

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

  const { requestCode, codeSent, setCodeSent } = useEmailVerification();
  const verifyMutation = useVerifyEmailCode(onVerified);

  const handleVerify = async () => {
    const isCodeValid = await trigger('code');
    if (!isCodeValid) return;

    verifyMutation.mutate({ email, code });
  };

  useEffect(() => {
    if (timer === 0 && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      alert('시간이 만료되었습니다. 재전송 버튼을 눌러 다시 인증을 진행해주세요.');
    }

    if (timer > 0 && !intervalId) {
      const id = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setIntervalId(id);
    }
  }, [timer, intervalId]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleRequestCode = async () => {
    setCodeSent(true);

    const isValid = await trigger('email');
    if (isValid) {
      requestCode(email);
      setTimer(300);
    }
  };

  return (
    <Container>
      <Title>
        PIN 등록 전에
        <br />
        이메일 인증이 필요합니다
      </Title>

      <FormContainer>
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
                  rightContent={timer > 0 ? { type: 'TIMER', time: formatTime(timer) } : undefined}
                >
                  <TextField.TextFieldBox type="text" placeholder="인증번호 입력" />
                  <TextField.ErrorText message={errors.code?.message ?? ''} />
                </TextField>
              )}
            />
          </motion.div>
        )}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              value={field.value}
              onChange={field.onChange}
              isError={!!errors.email}
              rightContent={
                codeSent
                  ? { type: 'RESEND', onClick: handleRequestCode }
                  : { type: 'DELETE', onClick: () => field.onChange('') }
              }
            >
              <TextField.TextFieldBox type="email" placeholder="이메일 주소 입력" />
              <TextField.ErrorText message={errors.email?.message ?? ''} />
            </TextField>
          )}
        />

        <BtnContainer>
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

export default PinEmailForm;
