// hooks/useVerifiedEmail.ts
import { useEffect, useState } from 'react';

const useVerifiedEmail = () => {
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('verifiedEmail');
    if (email) setVerifiedEmail(email);
  }, []);

  return verifiedEmail;
};

export default useVerifiedEmail;
