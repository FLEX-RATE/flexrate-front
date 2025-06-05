import PasskeyRegisterPage from '@/components/fido2/PasskeyRegisterPage';

type Props = {
  searchParams: {
    memberId: string;
  };
};

const RegisterPage = ({ searchParams }: Props) => {
  const memberId = searchParams.memberId ? Number(searchParams.memberId) : null;

  if (!memberId) {
    return <div>잘못된 회원 정보입니다.</div>;
  }

  return <PasskeyRegisterPage memberId={memberId} />;
};

export default RegisterPage;