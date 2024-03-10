import { Avatar, Button, Drawer, Form, Input, message, Select, Spin, Tag, Upload } from 'antd';
import type { FC } from 'react';
import { memo, useState } from 'react';

import avatar_upload from '@/assets/images/avatar_upload.png';
import { AllowType, GroupVerificationType } from '@/constants/enum';
import { createGroup, updateGroup } from '@/services/server/group_manage';
import { splitUpload } from '@/services/server/upload';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import type { GroupInfo } from './data';
import type { SelectedListItem, SelectModalOptions } from './SelectUserModal';
import SelectUserModal from './SelectUserModal';

export type DrawerOptions = {
  visible: boolean;
  opType: 'create' | 'edit';
  groupInfo?: GroupInfo;
};

type GroupActionProps = {
  drawerOptions: DrawerOptions;
  closeDrawer: () => void;
  reload: () => void;
};

type AddGroupFormFields = {
  groupName: string;
  adminUserIDs: string[];
  memberUserIDs: string[];
  ownerUserID: string;
  needVerification: number;
  groupID: string;
  notification: string;
  introduction: string;
  ex: string;
  lookMemberInfo: number;
  applyMemberFriend: number;
};

type OpGroupPageProps = {
  opType: 'create' | 'edit';
  groupInfo?: GroupInfo;
  closeDrawer: () => void;
  reload: () => void;
};

const OpGroupPage: FC<OpGroupPageProps> = memo(({ closeDrawer, reload, opType, groupInfo }) => {
  const [fetching, setFetching] = useState(false);
  const [uploadState, setUploadState] = useState({
    url: undefined as string | undefined,
    loading: false,
  });
  const [selectModalOptions, setSelectModalOptions] = useState<SelectModalOptions>({
    visible: false,
    selectType: 'member',
  });
  const [selectItems, setSelectItems] = useState({
    owner: {
      data: [],
    } as SelectedListItem,
    admin: {
      data: [],
    } as SelectedListItem,
    member: {
      data: [],
    } as SelectedListItem,
  });
  const [form] = Form.useForm();

  const closeSelectModal = () => {
    setSelectModalOptions({
      visible: false,
      selectType: 'member',
    });
  };

  const selectedCallBack = (data: SelectedListItem, type: 'owner' | 'admin' | 'member') => {
    const tmpData = { ...selectItems };
    tmpData[type] = data;
    setSelectItems(tmpData);
    if (type === 'owner') {
      form.setFieldValue('ownerUserID', data.data[0].userID);
    }
    if (type === 'admin') {
      const tmpArr = data.data.map((user) => ({
        roleLevel: 1,
        userID: user.userID,
      }));
      form.setFieldValue(
        'adminUserIDs',
        tmpArr.map((e) => e.userID),
      );
    }
    if (type === 'member') {
      const tmpArr = data.data.map((user) => ({
        roleLevel: 1,
        userID: user.userID,
      }));
      form.setFieldValue(
        'memberUserIDs',
        tmpArr.map((e) => e.userID),
      );
    }
  };

  const onFinish = async (values: AddGroupFormFields) => {
    setFetching(true);
    try {
      if (opType === 'create') {
        await createGroup({
          memberUserIDs: values.memberUserIDs,
          adminUserIDs: values.adminUserIDs,
          ownerUserID: values.ownerUserID,
          groupInfo: {
            groupName: values.groupName,
            notification: values.notification,
            introduction: values.introduction,
            faceURL: uploadState.url,
            groupType: 2,
            needVerification: values.needVerification,
            lookMemberInfo: values.lookMemberInfo,
            applyMemberFriend: values.applyMemberFriend,
          },
        });
      } else {
        if (!hasUpdated(groupInfo, { ...values, faceURL: uploadState.url ?? groupInfo?.faceURL })) {
          setFetching(false);
          return;
        }

        await updateGroup({
          groupInfoForSet: {
            groupID: values.groupID,
            groupName: values.groupName,
            notification: values.notification,
            introduction: values.introduction,
            faceURL: uploadState.url,
            needVerification: values.needVerification,
            lookMemberInfo: values.lookMemberInfo,
            applyMemberFriend: values.applyMemberFriend,
          },
        });
      }
      message.success('操作成功！');
      reload();
      form.resetFields();
      closeDrawer();
    } catch (error) {}
    setFetching(false);
  };

  const customUpload = async (data: UploadRequestOption) => {
    setUploadState((state) => ({ ...state, loading: true }));
    try {
      const { url: avatarUrl } = await splitUpload(data.file as File);
      if (avatarUrl) {
        setUploadState({ url: avatarUrl, loading: false });
      }
    } catch (error) {
      setUploadState((state) => ({ ...state, loading: false }));
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <div className="w-full text-center mb-12">
          <Spin spinning={uploadState.loading}>
            <div className="flex flex-col">
              <Upload accept="image/*" customRequest={customUpload} showUploadList={false}>
                <Avatar
                  shape="square"
                  size={55}
                  src={uploadState.url || groupInfo?.faceURL || avatar_upload}
                />
                <div className="text-[#1890FFFF] mt-3">点击上传</div>
              </Upload>
            </div>
          </Spin>
        </div>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          initialValues={opType === 'create' ? undefined : groupInfo}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label="名称"
            name="groupName"
            rules={[{ required: true, message: '请输入群组名称!' }]}
          >
            <Input maxLength={15} placeholder="请输入群组名称" />
          </Form.Item>

          {opType === 'edit' && (
            <Form.Item label="群ID" name="groupID">
              <Input disabled />
            </Form.Item>
          )}

          <Form.Item
            label="群验证"
            name="needVerification"
            rules={[{ required: true, message: '请选择群类型!' }]}
          >
            <Select>
              <Select.Option value={GroupVerificationType.AllNeed}>需要发送验证消息</Select.Option>
              <Select.Option value={GroupVerificationType.AllNot}>允许所有人加群</Select.Option>
              <Select.Option value={GroupVerificationType.ApplyNeedInviteNot}>
                群成员邀请无需验证
              </Select.Option>
            </Select>
          </Form.Item>

          {opType === 'edit' && (
            <>
              <Form.Item label="群公告" name="notification">
                <Input.TextArea
                  autoSize={{ maxRows: 3, minRows: 3 }}
                  maxLength={250}
                  placeholder="请输入群公告"
                />
              </Form.Item>
              <Form.Item label="群简介" name="introduction">
                <Input.TextArea
                  autoSize={{ maxRows: 3, minRows: 3 }}
                  maxLength={250}
                  placeholder="请输入群公告"
                />
              </Form.Item>
              <Form.Item
                label="添加好友"
                name="applyMemberFriend"
                rules={[{ required: true, message: '请选择群权限!' }]}
              >
                <Select>
                  <Select.Option value={AllowType.Allowed}>允许群内添加好友</Select.Option>
                  <Select.Option value={AllowType.NotAllowed}>不允许群内添加好友</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="查看资料"
                name="lookMemberInfo"
                rules={[{ required: true, message: '请选择查看资料权限!' }]}
              >
                <Select>
                  <Select.Option value={AllowType.Allowed}>允许查看群员资料</Select.Option>
                  <Select.Option value={AllowType.NotAllowed}>不允许查看群员资料</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {opType === 'create' && (
            <>
              <Form.Item
                label="群主"
                name="ownerUserID"
                rules={[{ required: true, message: '请选择群主!' }]}
              >
                <div
                  onClick={() => {
                    setSelectModalOptions({
                      visible: true,
                      selectType: 'owner',
                      preSelectData: selectItems.owner,
                    });
                  }}
                  className="h-8 border border-solid border-[#D9D9D9] rounded cursor-pointer px-1 py-1 truncate"
                >
                  {selectItems.owner.data.map((item) => (
                    <Tag key={item.userID}>{item.nickname}</Tag>
                  ))}
                </div>
              </Form.Item>

              <Form.Item
                label="管理员"
                name="adminUserIDs"
                rules={[{ required: false, message: '请选择管理员!' }]}
              >
                <div
                  onClick={() => {
                    setSelectModalOptions({
                      visible: true,
                      selectType: 'admin',
                      preSelectData: selectItems.admin,
                    });
                  }}
                  className="h-8 border border-solid border-[#D9D9D9] rounded cursor-pointer px-1 py-1 truncate"
                >
                  {selectItems.admin.data.map((item) => (
                    <Tag key={item.userID}>{item.nickname}</Tag>
                  ))}
                </div>
              </Form.Item>

              <Form.Item
                label="群成员"
                name="memberUserIDs"
                rules={[{ required: true, message: '请选择群成员!' }]}
              >
                <div
                  onClick={() => {
                    setSelectModalOptions({
                      visible: true,
                      selectType: 'member',
                      preSelectData: selectItems.member,
                    });
                  }}
                  className="h-8 border border-solid border-[#D9D9D9] rounded cursor-pointer px-1 py-1 truncate"
                >
                  {selectItems.member.data.map((item) => (
                    <Tag key={item.userID}>{item.nickname}</Tag>
                  ))}
                </div>
              </Form.Item>
            </>
          )}

          <div className="w-full text-right">
            <Button className="px-6" type="primary" htmlType="submit" loading={fetching}>
              确定
            </Button>
          </div>
        </Form>
      </div>
      <SelectUserModal
        selectModalOptions={selectModalOptions}
        selectedCallBack={selectedCallBack}
        closeSelectModal={closeSelectModal}
      />
    </div>
  );
});

const GroupActionDrawer: FC<GroupActionProps> = (props) => {
  const { drawerOptions, closeDrawer, reload } = props;

  return (
    <Drawer
      title={drawerOptions.opType === 'create' ? '新建群组' : '群组设置'}
      placement="right"
      closable={false}
      onClose={closeDrawer}
      open={drawerOptions.visible}
    >
      {drawerOptions.visible && (
        <OpGroupPage
          opType={drawerOptions.opType}
          reload={reload}
          groupInfo={drawerOptions.groupInfo}
          closeDrawer={closeDrawer}
        />
      )}
    </Drawer>
  );
};

export default GroupActionDrawer;

const checkUpdatedFileds = [
  'applyMemberFriend',
  'needVerification',
  'lookMemberInfo',
  'groupName',
  'faceURL',
  'introduction',
  'notification',
];

const hasUpdated = (oldData: any, newData: any) =>
  checkUpdatedFileds.some((field) => oldData[field] !== newData[field]);
