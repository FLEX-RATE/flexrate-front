'use client';

import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '@/components/Button/Button';
import TextField from '@/components/TextField/TextField';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useVerifyEmailCode } from '@/hooks/useVerifyEmailCode';

import { MainContainer, Title } from '../MypageEditFunnel.style';

import { BtnContainer, BtnWrapper, FormContainer } from './EmailStep.style';

interface Props {
  value: { email: string; code: string };
  onChange: (ctx: { email: string; code: string }) => void;
  onNext: (email: string) => void;
}

const emailWithCodeSchema = z.object({
  email: z.string().nonempty('이메일을 입력해주세요').email('이메일 형식이 올바르지 않아요'),
  code: z.string().min(4, '인증번호를 입력해주세요'),
});

type FormData = z.infer<typeof emailWithCodeSchema>;

export const EmailStep = ({ value, onChange, onNext }: Props) => {
  const [timer, setTimer] = useState(0);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    control,
    watch,
    trigger,
    formState: { errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(emailWithCodeSchema),
    mode: 'onChange',
    defaultValues: {
      email: value.email,
      code: value.code,
    },
  });

  const email = watch('email');
  const code = watch('code');

  const { requestCode, codeSent, setCodeSent } = useEmailVerification();
  const verifyMutation = useVerifyEmailCode((email) => onNext(email));

  const handleVerify = async () => {
    const isCodeValid = await trigger('code');
    if (!isCodeValid) return;
    verifyMutation.mutate({ email, code });
  };

  const prevRef = useRef<{ email: string; code: string }>({ email, code });
  useEffect(() => {
    const prev = prevRef.current;
    if (prev.email !== email || prev.code !== code) {
      prevRef.current = { email, code };
      onChange?.({ email, code });
    }
  }, [email, code, onChange]);

  useEffect(() => {
    if (timer > 0 && !intervalIdRef.current) {
      intervalIdRef.current = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    if (timer === 0 && intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
      alert('시간이 만료되었습니다. 재전송 버튼을 눌러 다시 인증을 진행해주세요.');
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [timer]);

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleRequestCode = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;

    requestCode(email);
    setCodeSent(true);
    setTimer(300);
  };

  return (
    <div style={{ width: '100%' }}>
      <MainContainer>
        <Title>새로운 이메일을 입력해주세요</Title>
        <FormContainer>
          {/* 코드 입력 영역 */}
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
                    rightContent={
                      timer > 0 ? { type: 'TIMER', time: formatTime(timer) } : undefined
                    }
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
        </FormContainer>
      </MainContainer>

      <BtnWrapper>
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
      </BtnWrapper>
    </div>
  );
};
