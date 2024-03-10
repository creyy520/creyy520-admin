import { API_URL } from '@/config';
import { request } from '@umijs/max';
export async function getLogs(data: API.LogManage.SearchLogs) {
  return request<{
    data: any;
  }>('/third/logs/search', {
    method: 'POST',
    data,
    baseURL: API_URL,
  });
}
export function deleteLog(logIDs: string[]) {
  return request<{
    data: any;
  }>('/third/logs/delete', {
    method: 'POST',
    data: { logIDs },
    baseURL: API_URL,
  });
}
