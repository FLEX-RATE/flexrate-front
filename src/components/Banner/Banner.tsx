'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  BannerContainer,
  BannerContent,
  BannerLabel,
  BannerDesc,
  BannerTextContainer,
  ReportBtn,
  ReportTitle,
} from './Banner.style';
import { BannerProps, bannerMetaMap } from './Banner.type';

const Banner = ({ isWithReport, type, borderNone }: BannerProps) => {
  const router = useRouter();
  const meta = type ? bannerMetaMap[type] : undefined;

  if (!meta) {
    return <></>;
  }

  return (
    <BannerContainer $borderNone={borderNone}>
      <BannerContent>
        <BannerTextContainer>
          <BannerLabel $bgColor={meta.bgColor} $color={meta.color}>
            {meta.label}
          </BannerLabel>
          <BannerDesc>{meta.description}</BannerDesc>
        </BannerTextContainer>
        <Image src={meta.icon} alt={`${meta.label} icon`} width={50} height={50} priority />
      </BannerContent>
      {isWithReport && (
        <ReportBtn onClick={() => router.push('/consumption-report')}>
          <ReportTitle>소비습관 리포트 확인하러 가기</ReportTitle>
          <Image src={'/icons/right_slide_arrow.svg'} width={8} height={13} alt="오른쪽 화살표" />
        </ReportBtn>
      )}
    </BannerContainer>
  );
};

export default Banner;
