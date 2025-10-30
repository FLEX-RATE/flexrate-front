'use client';

import { useCallback, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';
import Header from '@/components/Header/Header';
import Modal from '@/components/Modal/Modal';
import {
  ModalFlexContainer,
  ModalTitle,
  ModalSubTitle,
  TitleContainer,
  ModalBtnContainer,
} from '@/components/Modal/Modal.style';
import NotificationItem from '@/components/NotificationItem/NotificationItem';
import { ChangeBtn } from '@/components/TextField/TextField.style';
import { useNotifications } from '@/hooks/useNotifications';
import { formatNotificationTime } from '@/utils/notificationDate';

import {
  Wrapper,
  TopSection,
  MainContainer,
  NotificationList,
  EmptyState,
  EmptyIcon,
  EmptyText,
  LoadingSpinner,
  ErrorMessage,
} from './page.style';

const NotificationPage = () => {
  const router = useRouter();
  const { notifications, loading, hasNext, error, loadMore, markAsRead, deleteAll, refresh } =
    useNotifications();

  const user = true;
  const observerRef = useRef<IntersectionObserver>();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const lastNotificationElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNext) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasNext, loadMore]
  );

  const openDeleteModal = () => {
    if (notifications.length === 0) return;
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleConfirmDelete = async () => {
    await deleteAll();
    closeDeleteModal();
  };

  const handleNotificationClick = async (id: number) => {
    router.push('/loan-result');
    await markAsRead(id);
  };

  const handleRetry = () => {
    refresh();
  };

  return (
    <Wrapper>
      <Header backIcon type="알림함" isLoggedIn={user} />

      <TopSection>
        <ChangeBtn
          style={{ marginLeft: 'auto' }}
          onClick={openDeleteModal}
          disabled={notifications.length === 0}
        >
          전체 삭제
        </ChangeBtn>
      </TopSection>

      <MainContainer>
        {error && (
          <ErrorMessage>
            <p>{error}</p>
            <button onClick={handleRetry}>다시 시도</button>
          </ErrorMessage>
        )}

        <NotificationList>
          {notifications.map((n, i) => {
            const isLast = i === notifications.length - 1;
            return (
              <div key={n.id} ref={isLast ? lastNotificationElementRef : null}>
                <NotificationItem
                  id={n.id}
                  message={n.content}
                  time={formatNotificationTime(n.sentAt)}
                  isRead={n.isRead}
                  onClick={handleNotificationClick}
                  delay={i * 0.1}
                />
              </div>
            );
          })}
        </NotificationList>

        {loading && notifications.length > 0 && (
          <LoadingSpinner>
            <div className="spinner" />
          </LoadingSpinner>
        )}

        {!loading && notifications.length === 0 && !error && (
          <EmptyState>
            <EmptyIcon>
              <Image
                src="/icons/alert_24.svg"
                width={48}
                height={48}
                alt="알림이 없습니다"
                style={{ opacity: 0.3 }}
                priority
              />
            </EmptyIcon>
            <EmptyText>알림이 없습니다</EmptyText>
          </EmptyState>
        )}

        {loading && notifications.length === 0 && (
          <LoadingSpinner>
            <div className="spinner" />
            <p>알림을 불러오는 중...</p>
          </LoadingSpinner>
        )}
      </MainContainer>

      {/* 하단 슬라이딩 삭제 모달 */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <ModalFlexContainer>
          <TitleContainer>
            <ModalTitle>알림을 전체 삭제할까요?</ModalTitle>
            <ModalSubTitle>삭제한 알림은 복구할 수 없어요</ModalSubTitle>
          </TitleContainer>

          <ModalBtnContainer>
            <Button varient="TERTIARY" onClick={closeDeleteModal} text="안할래요" />
            <Button varient="PRIMARY" onClick={handleConfirmDelete} text="전체 삭제할게요" />
          </ModalBtnContainer>
        </ModalFlexContainer>
      </Modal>
    </Wrapper>
  );
};

export default NotificationPage;
