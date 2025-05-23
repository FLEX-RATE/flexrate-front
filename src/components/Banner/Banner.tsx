'use client';

import Image from 'next/image';

import { BannerContainer, BannerContent, BannerLabel, BannerDesc } from './Banner.style';
import { BannerProps, bannerMetaMap } from './Banner.type';

const Banner = ({ type, borderNone }: BannerProps) => {
  const meta = type ? bannerMetaMap[type] : undefined;

  if (!meta) {
    return <></>;
  }

  return (
    <BannerContainer $borderNone={borderNone}>
      <BannerContent>
        <BannerLabel $bgColor={meta.bgColor} $color={meta.color}>
          {meta.label}
        </BannerLabel>
        <BannerDesc>{meta.description}</BannerDesc>
      </BannerContent>
      <Image src={meta.icon} alt={`${meta.label} icon`} width={50} height={50} />
    </BannerContainer>
  );
};

export default Banner;
