import { EventSourcePolyfill } from 'event-source-polyfill';

import { useUserStore } from '@/stores/userStore';
import {
  Notification as AppNotification,
  NotificationCountResponse,
  NotificationResponse,
} from '@/types/notification.type';

import { apiClient } from './client';

class NotificationAPI {
  private getAuthHeaders() {
    const accessToken = useUserStore.getState().accessToken;
    if (!accessToken) {
      throw new Error('Access token이 없습니다.');
    }
    return { Authorization: `Bearer ${accessToken}` };
  }
  // SSE 연결 설정 (쿼리 파라미터로만 인증)
  connectSSE(
    onNotification: (notification: AppNotification, accessToken: string) => void
  ): EventSource {
    const accessToken = useUserStore.getState().accessToken;

    if (!accessToken) {
      throw new Error('Access token이 없습니다. SSE 연결 불가');
    }

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notification/subscribe?token=${accessToken}`,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener('notification', (event) => {
      const messageEvent = event as MessageEvent;
      const notification: AppNotification = JSON.parse(messageEvent.data);
      onNotification(notification, accessToken); // 여기서도 전달
    });

    return eventSource;
  }

  // 알림 목록 조회 (무한스크롤)
  async getNotifications(lastNotificationId?: number): Promise<NotificationResponse> {
    const params = lastNotificationId ? { lastNotificationId } : {};

    try {
      const { data } = await apiClient.get<NotificationResponse>('/api/notification', {
        headers: this.getAuthHeaders(),
        params,
      });
      return data;
    } catch (error) {
      throw new Error('알림 조회 실패');
    }
  }

  // 읽음 처리
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await apiClient.post(`/api/notification/read/${notificationId}`, null, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      throw new Error('읽음 처리 실패');
    }
  }

  // 전체 삭제
  async deleteAll(): Promise<void> {
    try {
      await apiClient.delete('/api/notification', {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      throw new Error('전체 삭제 실패');
    }
  }

  // 읽지 않은 알림 개수
  async getUnreadCount(): Promise<NotificationCountResponse> {
    try {
      const { data } = await apiClient.get<NotificationCountResponse>(
        `/api/notification/unread-count`,
        {
          headers: this.getAuthHeaders(),
        }
      );
      return data;
    } catch (error) {
      throw new Error('읽지 않은 알림 개수 조회 실패');
    }
  }
}

export const notificationAPI = new NotificationAPI();
