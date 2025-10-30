'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { patchEmailChange } from '@/apis/auth';
import { BtnContainer, MainContainer, SubContainer, Wrapper } from '@/app/mypage/page.style';
import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import { FlexContainer } from '@/components/loanApplicationFunnel/CreditStep/CreditStep.style';
import { Container } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import TextField from '@/components/TextField/TextField';
import { useUserStore } from '@/stores/userStore';

const EditPage = () => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('pendingEmail') || user?.email || '';
    }
    return user?.email || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('pendingEmail');
      setEmail(pending || user?.email || '');
    } else {
      setEmail(user?.email || '');
    }
  }, [user?.email]);

  useEffect(() => {
    if (user === null) {
      router.replace('/auth/login');
    }
  }, [user, router]);

  const handleBack = () => router.back();
  const handleEmailEdit = () => router.push('/mypage/edit-email');

  const handleSave = async () => {
    try {
      await patchEmailChange(email);
      const cur = useUserStore.getState().user;
      setUser(cur ? { ...cur, email } : null);

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pendingEmail');
      }
      router.push('/mypage');
    } catch (err) {
      console.error('Error updating email:', err);
      alert('이메일 변경에 실패했습니다.');
    }
  };

  const isSaveEnabled = !!user && !!email && email !== user.email;

  if (user === null) return null;

  return (
    <Wrapper>
      <Header type="내 정보 변경" backIcon onClickBackIcon={() => router.push('/')} />

      <Container>
        <MainContainer>
          <SubContainer>
            <TextField value={''} onChange={() => {}} isDisabled>
              <TextField.Label>이름</TextField.Label>
              <TextField.TextFieldBox placeholder={user?.username} />
            </TextField>
          </SubContainer>

          <SubContainer>
            <TextField
              value={email}
              onChange={setEmail}
              isDisabled
              rightContent={{ type: 'CHANGE', onClick: handleEmailEdit }}
            >
              <TextField.Label>이메일</TextField.Label>
              <TextField.TextFieldBox placeholder={user?.email} />
            </TextField>
          </SubContainer>
        </MainContainer>

        <BtnContainer>
          <FlexContainer>
            <Button size="XS" text="취소" varient="S_SPECIAL" onClick={handleBack} />
            <Button
              text="저장하기"
              varient="PRIMARY"
              onClick={handleSave}
              disabled={!isSaveEnabled}
            />
          </FlexContainer>
        </BtnContainer>
      </Container>
    </Wrapper>
  );
};

export default EditPage;
