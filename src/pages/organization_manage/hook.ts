import { getAllOrganization, getOrganizationInfo } from '@/services/server/organization_manage';
import { message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type {
  DepartmentDrawerType,
  DepartmentList,
  ModalType,
  Organization,
  TreeNode,
  UserDrawerType,
} from './data';

// 递归生成treeDate
const convertToTreeData = (data: DepartmentList[], showNum: boolean) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const { department, subdepartments } = data[i];
    const { departmentID, name, memberNum, order } = department;
    const children: TreeNode[] = subdepartments ? convertToTreeData(subdepartments, showNum) : [];
    if (!showNum && order < 0) {
      continue;
    }
    result.push({
      key: departmentID,
      title: `${name}${memberNum && showNum ? `(${memberNum}人)` : ''}`,
      children,
      memberNum,
    });
  }
  return result;
};

// 寻找父节点
export const getParentKey = (
  data: TreeNode[],
  targetKey: string | number,
  parentKey = '',
): string => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.key === String(targetKey)) {
      // 如果找到目标节点，则返回其父节点的 key
      return parentKey;
    } else if (node.children && node.children.length > 0) {
      // 如果当前节点有子节点，则递归遍历子节点
      const result = getParentKey(node.children, String(targetKey), node.key);
      if (result) {
        return result;
      }
    }
  }
  // 如果在当前子树中没有找到目标节点，则返回 ''
  return '';
};

// 根据父节点找节点数组
export const getNodeChildrenByKey = (data: TreeNode[], targetKey: string): TreeNode[] | [] => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.key === targetKey) {
      // 如果找到目标节点，则返回其子节点列表
      return node.children;
    } else if (node.children && node.children.length > 0) {
      // 如果当前节点有子节点，则递归遍历子节点
      const result = getNodeChildrenByKey(node.children, targetKey);
      if (result.length > 0) {
        return result;
      }
    }
  }
  // 如果在当前子树中没有找到目标节点，则返回 []
  return [];
};

// 获取公司信息/所有部门
export const useOrganization = () => {
  const [departmentList, setDepartmentList] = useState<DepartmentList[]>();
  const [organization, setOrganization] = useState<Organization>();

  const getOrganization = async () => {
    const { data } = await getAllOrganization();
    const { data: orgData } = await getOrganizationInfo();
    setDepartmentList(data.departments);
    setOrganization(orgData);
  };

  const refresh = useCallback(() => {
    getOrganization();
  }, []);

  useEffect(() => {
    getOrganization();
  }, []);

  const treeData = convertToTreeData(departmentList ?? [], false);
  const treeDataHasNum = convertToTreeData(departmentList ?? [], true);

  return { organization, departmentList, treeData, treeDataHasNum, refresh };
};

// 通用模态框
export const useHintModal = (
  selectedRowKeys: string[],
  setUserID: (id: string) => void,
  refreshData: () => void,
) => {
  const [modalType, setModalType] = useState<ModalType>(undefined);
  useEffect(() => {
    if (!modalType) {
      console.log('通用模态框关闭,刷新数据');
      refreshData();
    }
  }, [modalType, refreshData]);

  const showModal = (id: string, type: ModalType) => {
    setUserID(id);
    setModalType(type);
  };

  const changeModal = (type: ModalType) => {
    if (
      (type === 'shuttle' ||
        type === 'removeUser' ||
        type === 'batchRemoveUser' ||
        type === 'deleteUser') &&
      selectedRowKeys.length === 0
    ) {
      message.error('请选择人员！');
      return;
    }
    setModalType(type);
  };

  return { modalType, setModalType, showModal, changeModal };
};

// 用户抽屉
export const useUserDrawer = (setUserID: (id: string) => void, refreshData: () => void) => {
  const [userDrawerType, setUserDrawerType] = useState<UserDrawerType>(undefined);
  const showUserDrawer = (id: string) => {
    setUserID(id);
    setUserDrawerType('edit');
  };

  // useEffect(() => {
  //   if (!userDrawerType) {
  //     console.log('用户抽屉,刷新数据');
  //     refreshData();
  //   }
  // }, [userDrawerType, refreshData]);

  return { userDrawerType, setUserDrawerType, showUserDrawer };
};

// 部门抽屉
export const useDepartmentDrawer = (refreshData: () => void) => {
  const [depDrawerType, setDepDrawerType] = useState<DepartmentDrawerType>(undefined);

  useEffect(() => {
    if (!depDrawerType) {
      console.log('部门抽屉关闭,刷新数据');
      refreshData();
    }
  }, [depDrawerType, refreshData]);

  return { depDrawerType, setDepDrawerType };
};
