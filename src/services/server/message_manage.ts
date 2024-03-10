import { API_URL } from '@/config';
import { request } from '@umijs/max';

export async function getChatLogs(data: API.ChatLog.GetChatLogParams) {
  return request<{
    data: any;
  }>('/msg/search_msg', {
    method: 'POST',
    data,
    baseURL: API_URL,
  });
}

export async function getsignalrecords(data: API.ChatLog.GetSignalrecords) {
  return request<{
    data: any;
  }>('/cms/signal/get_signal_records', {
    method: 'POST',
    data,
  });
}

export function revokeMessage(data: API.ChatLog.RevokeMessageParams) {
  return request<{
    data: any;
  }>('/msg/revoke_msg', {
    method: 'POST',
    data,
    baseURL: API_URL,
  });
}
