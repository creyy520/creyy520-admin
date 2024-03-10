import { splitUpload } from '@/services/server/upload';
import { update_info } from '@/services/server/user_manage';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Avatar, Button, Card, Input, Space, Upload } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useState } from 'react';

const Profile = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { nickname, faceURL } = initialState?.currentUser;
  const [userInfo, setUserInfo] = useState({
    nickname,
    faceURL,
  });
  const [loading, setLoading] = useState(false);

  const updateUserField = async (key: 'nickname' | 'faceURL', value: string) => {
    await update_info({
      userID: localStorage.getItem('IMAdminUserID')!,
      [key]: value,
    });
    await setInitialState((s) => ({
      ...s,
      currentUser: {
        ...s?.currentUser,
        [key]: value,
      },
    }));
    setUserInfo((info) => ({
      ...info,
      [key]: value,
    }));
  };

  const customUpload = async (data: UploadRequestOption) => {
    try {
      const { url: avatarUrl } = await splitUpload(data.file as File);
      if (avatarUrl) {
        updateUserField('faceURL', avatarUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateAdminInfo = async () => {
    if (!userInfo.nickname) return;
    setLoading(true);
    await updateUserField('nickname', userInfo.nickname);
    setLoading(false);
  };

  return (
    <PageContainer>
      <Card>
        <div className="mb-4 font-medium text-base">头像</div>
        <Upload accept="image/*" customRequest={customUpload} showUploadList={false}>
          <Avatar shape="square" size={110} src={faceURL || '/icons/icon.png'} />
          <div className="text-[#1890FFFF] mt-3">
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </div>
        </Upload>

        <div className="my-4 font-medium text-base">昵称</div>
        <Space.Compact>
          <Input
            value={userInfo.nickname}
            onChange={(e) => {
              setUserInfo({
                ...userInfo,
                nickname: e.target.value,
              });
            }}
            style={{ width: '260px' }}
          />
          <Button loading={loading} onClick={updateAdminInfo} type="primary">
            保存
          </Button>
        </Space.Compact>
      </Card>
    </PageContainer>
  );
};

export default Profile;
