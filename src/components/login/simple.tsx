// pages/login/simple.tsx (혹은 해당 Funnel 단계 컴포넌트)
import SimplePasswordPad from '../../components/signup/SimplePasswordSetup';
import { simpleLogin } from '@/apis/auth';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';

export default function SimpleLogin({ email }: { email: string }) {
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  const handleLogin = async (pin: string) => {
    try {
      const { user, accessToken } = await simpleLogin({ email, simplePassword: pin });
      setUser(user);
      router.push('/home');
    } catch (err) {
      alert('비밀번호가 일치하지 않거나 존재하지 않습니다.');
    }
  };

  return <SimplePasswordPad onSubmit={handleLogin} />;
}
