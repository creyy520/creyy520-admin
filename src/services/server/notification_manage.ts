import { API_URL } from '@/config';
import { request } from '@umijs/max';

export async function getNotificationAccounts(
  params: API.NotificationManage.QueryNotificationAccountParams,
) {
  return request('/user/search_notification_account', {
    method: 'POST',
    data: {
      ...params,
    },
    baseURL: API_URL,
  });
}

export async function addNotificationAccount(userID: string, nickName: string, faceURL: string) {
  return request('/user/add_notification_account', {
    method: 'POST',
    data: {
      userID,
      nickName,
      faceURL,
    },
    baseURL: API_URL,
  });
}

export async function updateNotificationAccount(
  params: API.NotificationManage.UpdateNotificationAccountParams,
) {
  return request('/user/update_notification_account', {
    method: 'POST',
    data: {
      ...params,
    },
    baseURL: API_URL,
  });
}

export async function batchSendNotification({
  recvIDList,
  isSendAll,
  sendID,
  text,
}: API.ChatLog.BatchSendParams) {
  return request('/msg/batch_send_msg', {
    method: 'POST',
    data: {
      isSendAll,
      sendID,
      recvIDs: recvIDList,
      groupID: '',
      senderNickname: '系统通知',
      senderFaceURL: '',
      senderPlatformID: 5,
      content: {
        notificationName: '系统通知',
        notificationType: 1,
        text,
        mixType: 0,
      },
      contentType: 1400,
      sessionType: 4,
      isOnlineOnly: false,
      notOfflinePush: false,
      offlinePushInfo: {
        title: '系统通知',
        desc: '系统通知',
        ex: '',
        iOSPushSound: 'default',
        iOSBadgeCount: true,
      },
    },
    baseURL: API_URL,
  });
}
