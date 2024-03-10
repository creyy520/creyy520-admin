export interface GetAllOrganizationRes {
  // current: Organization;
  departments: DepartmentList[];
}

export interface TreeNode {
  key: string;
  title: string;
  memberNum?: number;
  children: TreeNode[];
}

// 创建、编辑部门的抽屉
export type DepartmentDrawerType = 'create' | 'edit' | undefined;

// 创建、编辑部门的抽屉
export type UserDrawerType = 'create' | 'edit' | undefined;

// 删除部门、重置密码、删除成员、移出成员、导入 对话框
export type ModalType =
  | 'deleteDepartment'
  | 'resetPassword'
  | 'deleteUser'
  | 'removeUser'
  | 'batchRemoveUser'
  | 'import'
  | 'shuttle'
  | undefined;

// 公司
export interface Organization {
  logoURL: string;
  name: string;
  homepage: string;
  // relatedGroupID: string;
  introduction: string;
  createTime?: string;
}

export interface MoveUserDepartment {
  currentDepartmentID?: string;
  departmentID: string;
  position?: string;
  userID: string;
}

// 部门列表
export interface DepartmentList {
  department: Department;
  subdepartments: DepartmentList[];
}

export interface Department {
  departmentID: string;
  faceURL: string;
  name: string;
  createTime: string;
  memberNum: number;
  position: string;
  order: number;
  memberPosition?: string;
}

export interface DepartmentUserRes {
  members: UserInfo[];
}

export interface Member {
  departmentID: string;
  position: string;
  station: string;
  createTime: number;
}

export interface User {
  userID: string;
  nickname: string;
  birth?: number;
  email?: string;
  faceURL: string;
  gender?: number;
  areaCode?: string;
  phoneNumber?: string;
  account: string;
  password: string;
}

export interface UserInfo {
  disabled?: boolean;
  user: User;
  member: Member;
  members: Member[];
}

export interface UserInfoAll {
  users: {
    user: User;
    members: Member[];
  }[];
}
