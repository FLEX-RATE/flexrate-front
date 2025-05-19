// components/signup/SimplePasswordSetup.tsx
import { useState } from 'react';

interface Props {
  onSubmit: (pin: string) => void;
}

export default function SimplePasswordSetup({ onSubmit }: Props) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'set' | 'confirm'>('set');

  const handleClick = (num: string) => {
    if (step === 'set' && pin.length < 6) setPin((prev) => prev + num);
    if (step === 'confirm' && confirmPin.length < 6) setConfirmPin((prev) => prev + num);
  };

  const handleDelete = () => {
    if (step === 'set') setPin((prev) => prev.slice(0, -1));
    else setConfirmPin((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (step === 'set' && pin.length === 6) {
      setStep('confirm');
    } else if (step === 'confirm' && confirmPin === pin) {
      onSubmit(pin);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setConfirmPin('');
    }
  };

  const current = step === 'set' ? pin : confirmPin;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-lg font-semibold">
        {step === 'set' ? '간편비밀번호 설정' : '간편비밀번호 재입력'}
      </div>
      <div className="text-2xl tracking-widest">{current.padEnd(6, '•')}</div>
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[...'123456789', '0'].map((num) => (
          <button key={num} onClick={() => handleClick(num)} className="bg-gray-200 py-4 rounded-xl text-xl">
            {num}
          </button>
        ))}
        <button onClick={handleDelete} className="col-span-3 bg-red-100 py-3 rounded-xl">
          삭제
        </button>
      </div>
      <button
        onClick={handleNext}
        disabled={current.length !== 6}
        className="w-full max-w-xs bg-blue-500 text-white py-3 rounded-xl disabled:bg-gray-400"
      >
        {step === 'set' ? '다음' : '완료'}
      </button>
    </div>
  );
}
