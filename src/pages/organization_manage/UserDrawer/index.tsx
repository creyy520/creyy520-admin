import avatar_upload from '@/assets/images/avatar_upload.png';
import {
  createUser,
  getUserInfo,
  updateUserDepartment,
  updateUserInfo,
} from '@/services/server/organization_manage';
import { splitUpload } from '@/services/server/upload';
import { countryCode } from '@/utils/areaCode';
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Avatar, Drawer, Form, Input, message, Select, Space, TreeSelect, Upload } from 'antd';
import md5 from 'md5';
import moment from 'moment';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';
import type { UserDrawerType } from '../data';

interface UserDrawerProps {
  type: UserDrawerType;
  treeData: any[];
  userID: string;
  departmentIdList: string[];
  refreshData: () => void;
  setUserDrawerType: (type: UserDrawerType) => void;
}

const UserDrawer = (props: UserDrawerProps) => {
  const { type, treeData, userID, departmentIdList, refreshData, setUserDrawerType } = props;
  const departmentID = departmentIdList[0];
  const [uploadUrl, setUploadUrl] = useState('');

  const [form] = Form.useForm();

  const onClose = () => {
    setTimeout(() => {
      form.resetFields();
      setUploadUrl('');
    }, 500);
    setUserDrawerType(undefined);
  };

  const getUser = async () => {
    const { data } = await getUserInfo([userID]);
    form.setFieldsValue({
      ...data.users[0].user,
      gender: data.users[0].user.gender == 1 ? '男' : '女',
      position: data.users[0].members.find((e) => e.departmentID === departmentID)?.position,
    });
    setUploadUrl(data.users[0].user.faceURL);
  };

  useEffect(() => {
    if (type === 'edit') {
      getUser();
    }
    if (type === 'create') {
      form.setFieldsValue({
        departmentID: departmentIdList[0],
      });
    }
  }, [type]);

  const onFinish = async (values: any) => {
    if (type === 'create') {
      try {
        const params = {
          user: {
            ...values,
            birth: moment(values.birth).unix() * 1000,
            faceURL: uploadUrl,
            areaCode: '+86',
            gender: values.gender,
            password: md5(values.password),
          },
          departments: [
            {
              departmentID: values.departmentID,
              position: values.position,
            },
          ],
        };
        await createUser(params);
        message.success('创建成功');
        onClose();
        refreshData();
      } catch (error) {
        console.log(error);
        message.error('创建失败，请重试！');
      }
    }
    if (type === 'edit') {
      try {
        await updateUserInfo({
          ...values,
          userID,
          birth: moment(values.birth).unix() * 1000,
          areaCode: '+86',
          gender: Number(values.gender),
          faceURL: uploadUrl,
        });
        if (departmentID) {
          await updateUserDepartment({
            departmentID,
            userID,
            station: '',
            position: values.position,
          });
        }
        message.success('修改成功');
        onClose();
        refreshData();
      } catch (error) {
        console.log(error);
        message.error('修改失败，请重试！');
      }
    }
  };

  const customUpload = async (data: UploadRequestOption) => {
    try {
      const { url: avatarUrl } = await splitUpload(data.file as File);
      if (avatarUrl) {
        setUploadUrl(avatarUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer
      title={type === 'create' ? '添加成员' : '修改成员'}
      placement="right"
      onClose={onClose}
      destroyOnClose
      open={type !== undefined}
    >
      <div className="w-full text-center mb-12">
        <div className="flex flex-col">
          <Upload accept="image/*" customRequest={customUpload} showUploadList={false}>
            <Avatar shape="square" size={55} src={uploadUrl || avatar_upload} />
            <div className="text-[#1890FFFF] mt-3">点击上传</div>
          </Upload>
        </div>
      </div>
      <ProForm
        labelCol={{ flex: '65px' }}
        labelAlign="right"
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
          submitButtonProps: {
            style: { marginLeft: 'auto' },
          },
          searchConfig: {
            submitText: type === 'create' ? '创建' : '修改',
          },
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        initialValues={{
          areaCode: '86',
        }}
      >
        <ProFormText
          name="nickname"
          label="用户名"
          width="md"
          rules={
            type === 'edit'
              ? []
              : [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ]
          }
        />
        <ProFormSelect
          name="gender"
          label="性别"
          valueEnum={{
            1: '男',
            2: '女',
          }}
        />

        <ProFormDatePicker
          name="birth"
          label="生日"
          width="md"
          fieldProps={{ disabledDate: (current) => current && current > moment().endOf('day') }}
        />

        <Form.Item required label={'手机号'}>
          <Space.Compact>
            <Form.Item name="areaCode">
              <Select onSearch={() => {}} showSearch className="!w-24">
                {countryCode.map((country) => (
                  <Select.Option
                    key={country.phone_code}
                    value={country.phone_code}
                  >{`+${country.phone_code}`}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[{ required: true, message: '请输入用户手机号!' }]}
            >
              <Input type="number" placeholder={'请输入用户手机号'} />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item name="email" label="邮箱">
          <Input type="email" placeholder={'请输入用户邮箱'} />
        </Form.Item>

        {type !== 'edit' && (
          <Form.Item
            name="departmentID"
            label="部门"
            rules={[
              {
                required: true,
                message: '请选择部门',
              },
            ]}
          >
            <TreeSelect
              placeholder="请选择部门"
              fieldNames={{ value: 'key' }}
              showSearch
              allowClear
              treeDefaultExpandAll
              treeData={treeData}
            />
          </Form.Item>
        )}
        {type === 'edit' && (
          <ProFormText name="position" label="职位" hidden={departmentIdList.length <= 0} />
        )}
        {type !== 'edit' && <ProFormText name="position" label="职位" />}
        {type !== 'edit' && (
          <ProFormText
            name="account"
            label="账号"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          />
        )}
        <ProFormText.Password
          name="password"
          label="密码"
          hidden={type === 'edit'}
          rules={
            type === 'edit'
              ? []
              : [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]
          }
        />
      </ProForm>
    </Drawer>
  );
};

export default UserDrawer;
