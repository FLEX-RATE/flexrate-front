import {
  Notification as AppNotification,
  NotificationCountResponse,
  NotificationResponse,
} from '@/types/notification.type';

import { apiClient } from './client';

class NotificationAPI {
  connectSSE(onNotification: (n: AppNotification) => void): EventSource {
    const eventSource = new EventSource('/api/bff/api/notification/subscribe');

    eventSource.addEventListener('notification', (event) => {
      const messageEvent = event as MessageEvent;
      const notification: AppNotification = JSON.parse(messageEvent.data);
      onNotification(notification);
    });

    eventSource.addEventListener('error', (event) => {
      console.error('SSE 에러 발생:', event);
    });

    return eventSource;
  }

  async getNotifications(lastNotificationId?: number): Promise<NotificationResponse> {
    const params = lastNotificationId ? `?lastNotificationId=${lastNotificationId}` : '';
    const { data } = await apiClient.get(`/api/notification${params}`);
    return data;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.post(`/api/notification/read/${notificationId}`);
  }

  async deleteAll(): Promise<void> {
    await apiClient.delete(`/api/notification`);
  }

  async getUnreadCount(): Promise<NotificationCountResponse> {
    const { data } = await apiClient.get(`/api/notification/unread-count`);
    return data;
  }
}

export const notificationAPI = new NotificationAPI();
