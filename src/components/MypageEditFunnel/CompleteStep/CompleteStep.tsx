import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Title } from '@/components/loanApplicationFunnel/LoanApplicationFunnel.style';
import { useUserStore } from '@/stores/userStore';

import { Wrapper } from '../MypageEditFunnel.style';

interface Props {
  email: string;
}

export const CompleteStep = ({ email }: Props) => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    sessionStorage.setItem('pendingEmail', email);

    const timer = setTimeout(() => {
      router.replace('/mypage/edit');
    }, 1000);

    return () => clearTimeout(timer);
  }, [email, setUser, router]);

  return (
    <Wrapper>
      <Title>이메일 인증이 완료되었습니다!</Title>
      <p>잠시 후 내 정보 변경 페이지로 이동합니다.</p>
    </Wrapper>
  );
};
