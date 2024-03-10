import {
  addNotificationAccount,
  getNotificationAccounts,
  updateNotificationAccount,
} from '@/services/server/notification_manage';
import { splitUpload } from '@/services/server/upload';
import { DefaultAvatar } from '@/utils/avatar';
import { UploadOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useRef, useState } from 'react';
import { NotificationAccount } from './data';

const customUpload = async (
  userID: string,
  data: UploadRequestOption,
  reload: (resetPageIndex?: boolean | undefined) => Promise<void>,
) => {
  try {
    const { url } = await splitUpload(data.file as File);
    if (url) {
      await updateNotificationAccount({
        userID,
        faceURL: url,
      });
      reload();
    }
  } catch (error) {
    console.log(error);
  }
};

const columns: ProColumns<NotificationAccount>[] = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    align: 'center',
  },
  {
    title: '用户头像',
    dataIndex: 'faceURL',
    valueType: 'avatar',
    key: 'faceURL',
    hideInSearch: true,
    editable: false,
    align: 'center',
    render(_, record, idx, action) {
      return (
        <Upload
          accept="image/*"
          customRequest={(option) => customUpload(record.userID, option, action?.reload)}
          showUploadList={false}
          className="cursor-pointer"
        >
          <DefaultAvatar faceURL={record.faceURL} nickname={record.nickName} />
        </Upload>
      );
    },
  },
  {
    title: '昵称',
    key: 'nickName',
    dataIndex: 'nickName',
    align: 'center',
  },
  {
    title: '用户ID',
    key: 'userID',
    dataIndex: 'userID',
    editable: false,
    align: 'center',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    align: 'center',
    render: (text, record, _, action) => {
      return (
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.userID);
          }}
        >
          编辑
        </a>
      );
    },
  },
];

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const NotificationAccountList = () => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const actionRef = useRef<ActionType>();

  const confirmAdd = async ({
    userID,
    nickName,
    avatar,
  }: {
    userID: string;
    nickName: string;
    avatar: UploadFile[];
  }) => {
    setAdding(true);
    try {
      const { url } = await splitUpload(avatar[0].originFileObj as File);
      if (!url) {
        throw Error('图片上传失败！');
      }
      await addNotificationAccount(userID, nickName, url);
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error?.message ?? '新增失败！');
    }
    setAdding(false);
    setAddModalVisible(false);
  };

  return (
    <PageContainer>
      <ProTable<NotificationAccount>
        columns={columns}
        cardBordered
        actionRef={actionRef}
        toolbar={{
          actions: [
            <Button
              key={'add'}
              type="primary"
              onClick={() => {
                setAddModalVisible(true);
              }}
            >
              新增
            </Button>,
          ],
          settings: [],
        }}
        columnsState={{
          defaultValue: {
            option: {
              fixed: 'right',
            },
          },
        }}
        request={async (params = {}, sort, filter) => {
          console.log(params, sort, filter);
          const { data } = await getNotificationAccounts({
            keyword: params.userID || params.nickName,
            pagination: {
              pageNumber: params.current as number,
              showNumber: params.pageSize as number,
            },
          });

          return {
            data: data.notificationAccounts ?? [],
            success: true,
            total: data.total,
          };
        }}
        editable={{
          type: 'multiple',
          actionRender: (row, config, doms) => {
            return [doms.save, doms.cancel];
          },
          onSave: (key, record) => {
            return updateNotificationAccount({
              userID: record.userID,
              nickName: record.nickName,
            });
          },
        }}
        rowKey="userID"
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
        }}
        dateFormatter="number"
        scroll={{ x: 'max-content' }}
      />
      <Modal
        title="新增"
        width={400}
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
        }}
        centered
        destroyOnClose
        footer={null}
      >
        <Form onFinish={confirmAdd} labelCol={{ span: 5 }}>
          <Form.Item
            name="avatar"
            label="头像"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请选择通知头像!' }]}
          >
            <Upload name="avatar" accept="image/*" listType="picture" maxCount={1} multiple={false}>
              <Button icon={<UploadOutlined />}>选择头像</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="nickName"
            label="名称"
            rules={[{ required: true, message: '请输入通知账号名称!' }]}
          >
            <Input placeholder="请输入通知账号名称" />
          </Form.Item>

          <Form.Item
            name="userID"
            label="账号ID"
            rules={[{ required: true, message: '请输入通知账号ID!' }]}
          >
            <Input placeholder="请输入通知账号ID" />
          </Form.Item>

          <div className="ml-[20%]">
            <Button type="primary" htmlType="submit" loading={adding}>
              确认新增
            </Button>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default NotificationAccountList;
