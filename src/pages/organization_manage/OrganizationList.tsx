import {
  getDepartmentUser,
  searchFull,
  sortDepartment,
} from '@/services/server/organization_manage';
import { deleBlock, updateBlock } from '@/services/server/user_manage';
import { DefaultAvatar } from '@/utils/avatar';
import {
  ApartmentOutlined,
  ClearOutlined,
  MenuOutlined,
  OrderedListOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, Card, message, Space, Tree } from 'antd';
import type { TreeProps } from 'antd/es/tree';
import { useCallback, useRef, useState } from 'react';
import type { UserInfo } from './data';
import DepartmentDrawer from './DepartmentDrawer';
import HintModel from './HintModel';
import {
  getNodeChildrenByKey,
  getParentKey,
  useDepartmentDrawer,
  useHintModal,
  useOrganization,
  useUserDrawer,
} from './hook';
import UserDrawer from './UserDrawer';

const OrganizationList = () => {
  const { organization, treeDataHasNum, treeData, refresh } = useOrganization();

  const tableRef = useRef<ActionType>();
  const [userID, setUserID] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentIdList, setDepartmentIdList] = useState<string[]>([]);

  const [draggable, setDraggable] = useState(false);

  // 表格选中用户
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as string[]);
  };

  // 刷新数据
  const refreshData = useCallback(() => {
    refresh();
    tableRef.current?.reload();
  }, [refresh]);

  // 通用模态框
  const { modalType, setModalType, showModal, changeModal } = useHintModal(
    selectedRowKeys,
    setUserID,
    refreshData,
  );

  // 部门抽屉相关
  const { depDrawerType, setDepDrawerType } = useDepartmentDrawer(refreshData);

  // 用户抽屉相关
  const { userDrawerType, setUserDrawerType, showUserDrawer } = useUserDrawer(
    setUserID,
    refreshData,
  );

  // 选中的部门
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (!selectedKeys.length) {
      return;
    }
    tableRef.current?.reset?.();
    setSelectedRowKeys([]);
    setDepartmentName((info.node.title as string).split('(')[0]);
    setDepartmentIdList(selectedKeys as string[]);
  };

  // 渲染职位
  const showPosition = (record: UserInfo) => {
    const hasDepartmentId = departmentIdList.length > 0;
    if (hasDepartmentId) {
      return <span>{record.member.position}</span>;
    }
    const positionList = record.members?.filter((dep) => !!dep.position).map((e) => e.position);
    return <span>{positionList?.join(',')}</span>;
  };

  // 部门拖拽
  const onDrop: TreeProps['onDrop'] = async (info) => {
    console.log('onDrop', info, treeData);

    // 当前部门ID
    const departmentID = info.dragNode.key.toString();

    // 目标部门
    const parentID = info.node.key.toString();

    // 当前部门父节点
    const currentParent = getParentKey(treeData, departmentID);
    // 当前部门兄弟节点
    const currentParentChildren = getNodeChildrenByKey(treeData, currentParent).map((e) => e.key);

    if (![currentParent, ...currentParentChildren].includes(parentID) && currentParent !== '') {
      message.warning('只能在同一部门下排序！');
      return;
    }

    if (!info.dropToGap) {
      const nextDepartmentID = getNodeChildrenByKey(treeData, parentID)[0]?.key || '';

      if (departmentID === nextDepartmentID) {
        return;
      }

      await sortDepartment({
        departmentID,
        nextDepartmentID,
      });
    } else {
      const currentParentID = getParentKey(treeData, parentID);
      const nextDepartmentID =
        getNodeChildrenByKey(treeData, currentParentID)?.[info.dropPosition]?.key ?? '';

      if (departmentID === nextDepartmentID) {
        return;
      }

      await sortDepartment({
        departmentID,
        nextDepartmentID,
      });
    }
    refresh();
  };

  const init = () => {
    setSelectedRowKeys([]);
    setDepartmentName('');
    setDepartmentIdList([]);
  };

  const columns: ProColumns<UserInfo>[] = [
    {
      title: '成员头像',
      key: 'faceURL',
      render: (_, record) => (
        <DefaultAvatar faceURL={record.user.faceURL} nickname={record.user.nickname} />
      ),
      search: false,
      align: 'center',
    },
    {
      title: '昵称',
      key: 'nickname',
      dataIndex: 'nickname',
      search: false,
      align: 'center',
      render: (_, record) => <span>{record.user.nickname}</span>,
    },
    {
      title: '用户名/ID',
      key: 'keyword',
      dataIndex: 'keyword',
      hideInTable: true,
      align: 'center',
      render: (_, record) => <span>{record.user.userID}</span>,
    },
    {
      title: '用户ID',
      key: 'userID',
      dataIndex: 'userID',
      search: false,
      align: 'center',
      render: (_, record) => <span>{record.user.userID}</span>,
    },
    {
      title: '手机号',
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      search: false,
      align: 'center',
      render: (_, record) => <span>{record.user.phoneNumber}</span>,
    },
    {
      title: '邮箱',
      key: 'email',
      dataIndex: 'email',
      search: false,
      align: 'center',
      render: (_, record) => <span>{record.user.email || '-'}</span>,
    },
    {
      title: '职务',
      key: 'position',
      search: false,
      align: 'center',
      render: (_, record) => <span>{showPosition(record)}</span>,
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      search: false,
      align: 'center',
      renderText(_, record) {
        return new Date(record.member.createTime).toLocaleString();
      },
    },
    {
      title: '操作',
      key: 'option',
      search: false,
      align: 'center',
      render: (_, record) => (
        <>
          <Button key="edit" type="link" onClick={() => showUserDrawer(record.user.userID ?? '')}>
            修改
          </Button>
          <Button
            key="reset"
            type="link"
            onClick={() => showModal(record.user.userID ?? '', 'resetPassword')}
          >
            重置密码
          </Button>
          {departmentIdList[0] !== '$ungrouped' &&
            record.members?.[0]?.departmentID !== '$ungrouped' && (
              <Button
                key="remove"
                type="link"
                onClick={() => showModal(record.user.userID ?? '', 'removeUser')}
              >
                移出
              </Button>
            )}
          <Button
            key="stop"
            type="link"
            onClick={() => {
              if (record.disabled) {
                deleBlock(record.user.userID).then(() => {
                  message.success('修改成功');
                  refreshData();
                });
              } else {
                updateBlock(record.user.userID).then(() => {
                  message.success('修改成功');
                  refreshData();
                });
              }
            }}
          >
            {record.disabled ? '启用' : '停用'}
          </Button>
        </>
      ),
    },
  ];

  // 左侧内容
  const LeftCard = (
    <Card style={{ width: '395px', marginRight: '5px' }} bordered={false}>
      <Space direction="vertical">
        <Space>
          <Button
            key="add"
            icon={<ApartmentOutlined />}
            onClick={() => setDepDrawerType('create')}
            disabled={departmentIdList[0] === '$ungrouped'}
          >
            添加
          </Button>
          <Button
            key="sort"
            icon={<OrderedListOutlined />}
            onClick={() => setDraggable(!draggable)}
          >
            排序
          </Button>
          <Button
            key="edit"
            icon={<ShareAltOutlined />}
            onClick={() => setDepDrawerType('edit')}
            disabled={departmentIdList.length <= 0 || departmentIdList[0] === '$ungrouped'}
          >
            修改
          </Button>
          <Button
            key="delete"
            icon={<ClearOutlined />}
            onClick={() => setModalType('deleteDepartment')}
            disabled={departmentIdList.length <= 0 || departmentIdList[0] === '$ungrouped'}
          >
            删除
          </Button>
        </Space>
        <Space style={{ marginTop: '16px', cursor: 'pointer' }} onClick={() => init()}>
          <Avatar src={<img src={organization?.logoURL || '/icons/icon.png'} alt="avatar" />} />
          <div>{organization?.name}</div>
        </Space>
        <div
          style={{
            background: 'rgb(230, 247, 255)',
            border: 'rgb(145, 213, 255) 1px solid',
            color: 'rgba(0, 137, 255, 1)',
            display: draggable ? 'flex' : 'none',
          }}
          className="h-10 flex justify-center items-center mt-3"
        >
          上下拖动调整部门排序
        </div>
        <Space>
          <Tree
            draggable={{ nodeDraggable: () => draggable, icon: <MenuOutlined /> }}
            selectedKeys={departmentIdList}
            blockNode={true}
            onSelect={onSelect}
            treeData={treeDataHasNum}
            onDrop={onDrop}
          />
        </Space>
      </Space>
    </Card>
  );

  // 表格头部按钮
  const headerTitle = (
    <Space direction="vertical" size="large">
      <div>{departmentName}</div>
      <Space>
        <Button key="add" type="primary" onClick={() => setUserDrawerType('create')}>
          新建成员
        </Button>
        {/* <Button key="sort">排序</Button> */}
        {departmentIdList.length > 0 && (
          <Button key="shuttle" onClick={() => changeModal('shuttle')}>
            调整部门
          </Button>
        )}
        <Button key="import" onClick={() => changeModal('import')}>
          导入
        </Button>
        <Button key="remove" onClick={() => changeModal('batchRemoveUser')}>
          批量移出
        </Button>
        {/* <Button key="delete" onClick={() => changeModal('deleteUser')}>
          删除
        </Button> */}
      </Space>
    </Space>
  );

  return (
    <>
      <DepartmentDrawer
        type={depDrawerType}
        departmentName={departmentName}
        departmentIdList={departmentIdList || []}
        setDepDrawer={setDepDrawerType}
      />
      <HintModel
        type={modalType}
        userID={userID}
        setModalType={setModalType}
        departmentIdList={departmentIdList || []}
        selectedRowKeys={selectedRowKeys}
        resetSelectedRowKeys={() => setSelectedRowKeys([])}
        init={init}
      />
      <UserDrawer
        type={userDrawerType}
        treeData={treeData}
        userID={userID}
        refreshData={refreshData}
        setUserDrawerType={setUserDrawerType}
        departmentIdList={departmentIdList}
      />
      <PageContainer>
        <ProTable<UserInfo>
          actionRef={tableRef}
          columns={columns}
          rowKey={(record: any) => record.user.userID}
          pagination={{
            showSizeChanger: true,
            pageSize: 10,
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          tableRender={(_, dom) => (
            <div className=" w-full flex flex-1">
              {LeftCard}
              <div className="flex-1">{dom}</div>
            </div>
          )}
          headerTitle={headerTitle}
          request={async (params = {}) => {
            // console.log(params.userID)
            // if (params.departmentIdList.length > 0) {
            //   return {};
            // }
            if (params.keyword) {
              const { data } = await searchFull({
                keyword: params.keyword as string,
                pagination: {
                  pageNumber: params.current as number,
                  showNumber: params.pageSize as number,
                },
              });
              init();
              console.log(data);
              const tableData = data.users.map((item: any) => ({
                ...item,
                user: item,
                member: item.members[0],
              }));
              return {
                data: tableData ?? [],
                success: true,
                total: data.users.length ?? 0,
              };
            }
            const { data } = await getDepartmentUser(params.departmentIdList);
            return {
              data: data.members ?? [],
              success: true,
              total: data.members?.length ?? 0,
            };
          }}
          params={{ departmentIdList }}
          dateFormatter="string"
        />
      </PageContainer>
    </>
  );
};

export default OrganizationList;
