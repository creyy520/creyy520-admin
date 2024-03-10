import { changeAdminPwd } from '@/services/server/user_manage';
import { PageContainer } from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Button, Card, Form, Input, message } from 'antd';
import md5 from 'md5';
import { stringify } from 'querystring';
import { flushSync } from 'react-dom';

type FormFields = {
  password: string;
  newPassword: string;
};

const loginOut = async () => {
  // await outLogin();
  localStorage.removeItem('IMAdminToken');
  localStorage.removeItem('IMAccountToken');
  const { search, pathname } = window.location;
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
  const redirect = urlParams.get('redirect');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: pathname + search,
      }),
    });
  }
};

const Profile = () => {
  const [form] = Form.useForm<FormFields>();
  const { setInitialState } = useModel('@@initialState');

  const onFinish = async ({ password, newPassword }: FormFields) => {
    if (!password || !newPassword) return message.error('请输入密码！');

    try {
      await changeAdminPwd({
        userID: localStorage.getItem('IMAdminUserID')!,
        currentPassword: md5(password),
        newPassword: md5(newPassword),
      });
      message.success('修改成功，请重新登录！', undefined, () => {
        flushSync(() => {
          setInitialState((s) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
      });
    } catch (error) {
      // message.error('修改失败！');
    }
  };

  return (
    <PageContainer>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="mt-4"
          style={{ width: '300px' }}
        >
          <Form.Item label="当前密码" name="password">
            <Input.Password allowClear placeholder="请输入您的原密码" />
          </Form.Item>

          <Form.Item label="新密码" name="newPassword" className="mb-8">
            <Input.Password allowClear placeholder="请输入您的新密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default Profile;
