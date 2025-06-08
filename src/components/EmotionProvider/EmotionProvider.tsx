'use client';

import { ReactNode } from 'react';

import { CacheProvider } from '@emotion/react';

import { emotionCache } from '@/utils/emotionCache';

export const EmotionProvider = ({ children }: { children: ReactNode }) => {
  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
};
