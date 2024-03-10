import { ACCOUNT_URL, CHAT_URL } from '@/config';
import type {
  DepartmentUserRes,
  GetAllOrganizationRes,
  Organization,
  UserInfoAll,
} from '@/pages/organization_manage/data';
import { request } from '@umijs/max';

// 全部部门 v3 √
export async function getAllOrganization() {
  return request<{ data: GetAllOrganizationRes }>('/organization/department/all', {
    method: 'POST',
    data: {},
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 获取部门内的所有用户 v3 √
export async function getDepartmentUser(departmentIDList: string[]) {
  return request<{ data: DepartmentUserRes }>('/organization/department/expand', {
    method: 'POST',
    data: {
      departmentID: departmentIDList[0],
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 创建部门 v3 √
export async function createDepartment(params: API.OrganizationManage.CreateDeartmentParams) {
  return request('/organization/department/add', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 修改部门 v3 √
export async function updateDepartment(params: API.OrganizationManage.UpdateDeartmentParams) {
  return request('/organization/department/update', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 删除部门 v3 √
export async function deleteDepartment(departmentIDs: string[]) {
  return request('/organization/department/del', {
    method: 'POST',
    data: {
      departmentIDs,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 批量移出 v3 √
export async function removeMember(params: { userID: string; departmentID: string }) {
  return request('/organization/department/member/del', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 上传excel ?
export async function importByExcel(file: File) {
  const data = new FormData();
  data.append('data', file);
  // data.append('operationID', uuid());
  return request('/organization/import', {
    method: 'POST',
    headers: {
      isAccount: true,
    },
    data,
    baseURL: ACCOUNT_URL,
  });
}

// 新增用户 v3 √
export async function createUser(params: API.OrganizationManage.CreateUserParams) {
  return request('/organization/user/add', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 查询用户 v3 √
export async function getUserInfo(userIDs: string[]) {
  return request<{ data: UserInfoAll }>('/organization/department/user', {
    method: 'POST',
    data: {
      userIDs,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 修改用户 v3 √
export async function updateUserInfo(params: API.OrganizationManage.UpdateUserInfoParams) {
  return request('/organization/user/update', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 修改用户部门 v3 √
export async function updateUserDepartment(
  params: API.OrganizationManage.UpdateUserDepartmentParams,
) {
  return request('/organization/department/member/update', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 获取公司信息 v3 √
export async function getOrganizationInfo() {
  return request<{ data: Organization }>('/organization/get', {
    method: 'POST',
    data: {},
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 修改公司信息 v3 √
export async function updateOrganizationInfo(params: Organization) {
  return request('/organization/set', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 获取子部门 v3 √
export async function getSubDepartment(departmentID: string) {
  return request('/organization/department/expand', {
    method: 'POST',
    data: {
      departmentID,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 移动用户所在部门 v3
export async function moveUserDepartment(params: API.OrganizationManage.MoveUserDepartmentParams) {
  return request('/organization/department/member/move', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 部门排序 v3 √
export async function sortDepartment(params: API.OrganizationManage.SortDepartment) {
  return request('/organization/department/sort', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: ACCOUNT_URL,
  });
}

// 搜索用户 v3 √
export async function searchFull(params: any) {
  return request('/user/search/full', {
    method: 'POST',
    data: {
      ...params,
    },
    headers: {
      isAccount: true,
    },
    baseURL: CHAT_URL,
  });
}
