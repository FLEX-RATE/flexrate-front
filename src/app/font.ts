import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: './assets/fonts/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
  preload: false,
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Malgun Gothic',
    'sans-serif',
  ],
});
