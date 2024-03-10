import { API_URL } from '@/config';
import { request } from '@umijs/max';

export async function getUserList(params: API.UserManage.GetUserParams) {
  return request('/user/get_users', {
    method: 'POST',
    data: {
      ...params,
    },
    baseURL: API_URL,
  });
}
