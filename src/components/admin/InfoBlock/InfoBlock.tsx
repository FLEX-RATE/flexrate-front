import React, { useEffect, useState } from 'react';

import { StyledInfoBlock, SkeletonInfoBox } from '@/components/admin/InfoBlock/InfoBlock.style';

type InfoBlockProps = {
  children: React.ReactNode;
};

const InfoBlock = ({ children }: InfoBlockProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <SkeletonInfoBox /> : <StyledInfoBlock>{children}</StyledInfoBlock>;
};

export default InfoBlock;
