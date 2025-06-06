'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import NotificationBadge from '@/components/NotificationBadge/NotificationBadge';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';

import {
  HeaderContainer,
  HeaderRightContainer,
  HeaderTitle,
  None,
  RightNone,
} from './Header.style';

type HeaderType =
  | '신용 점수 평가'
  | '대출 신청'
  | '알림함'
  | '우리금융그룹'
  | '소비 습관 리포트'
  | '마이페이지'
  | '내 정보 변경';

interface HeaderProps {
  type?: HeaderType;
  backIcon?: boolean;
  onClickBackIcon?: () => void;
  isLoggedIn?: boolean;
  hasLoan?: boolean;
  onLogoutClick?: () => void;
}

const Header = ({
  type,
  backIcon = false,
  isLoggedIn,
  onLogoutClick,
  onClickBackIcon,
}: HeaderProps) => {
  const router = useRouter();
  const { unreadCount } = useUnreadNotificationCount();
  const notifications = () => router.push('/notifications');
  const mypage = () => router.push('/mypage');

  const handleBack = () => {
    if (onClickBackIcon) {
      onClickBackIcon();
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const renderRightIcons = () => {
    if (type === '우리금융그룹' && isLoggedIn) {
      return (
        <HeaderRightContainer>
          <NotificationBadge unreadCount={unreadCount} onClick={notifications} showCount={true} />
          <Image
            src="/icons/webee_36.svg"
            width={36}
            height={36}
            alt="마이페이지"
            onClick={mypage}
          />
        </HeaderRightContainer>
      );
    }

    if (type === '알림함' && isLoggedIn) {
      return (
        <HeaderRightContainer>
          <Image
            src="/icons/webee_36.svg"
            width={36}
            height={36}
            alt="마이페이지"
            onClick={mypage}
          />
        </HeaderRightContainer>
      );
    }

    if (type === '마이페이지' && isLoggedIn) {
      return (
        <HeaderRightContainer>
          <Image
            src="/icons/logout_36.svg"
            width={36}
            height={36}
            alt="로그아웃"
            onClick={onLogoutClick}
          />
        </HeaderRightContainer>
      );
    }

    if ((type === '소비 습관 리포트' || type === '대출 신청') && isLoggedIn) {
      return <None />;
    }

    return <RightNone />;
  };

  return (
    <HeaderContainer>
      {backIcon ? (
        <Image
          src="/icons/backArrow_36.svg"
          width={36}
          height={36}
          alt="뒤로가기"
          onClick={handleBack}
        />
      ) : type === '우리금융그룹' && !isLoggedIn ? (
        <RightNone />
      ) : (
        <None />
      )}
      <HeaderTitle>{type}</HeaderTitle>
      {renderRightIcons()}
    </HeaderContainer>
  );
};

export default Header;
