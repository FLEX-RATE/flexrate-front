// app/fido2/register/page.tsx
import React from 'react';

import PasskeyRegisterForm from '@/components/fido2/PasskeyRegisterForm';

export default function PasskeyRegisterPage() {
  return (
    <main>
      <h1>패스키 등록</h1>
      <PasskeyRegisterForm />
    </main>
  );
}