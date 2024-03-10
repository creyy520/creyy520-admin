// import type { UploadProps } from 'antd/es/upload/interface';
// import { minioUpload, minioUploadType } from '@/services/admin/upload';
// import { UploadOutlined } from '@ant-design/icons';

import { getOrganizationInfo, updateOrganizationInfo } from '@/services/server/organization_manage';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Button, Card, Input, message, Space, Upload } from 'antd';

import { splitUpload } from '@/services/server/upload';
import { UploadOutlined } from '@ant-design/icons';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';
import type { Organization } from './data';

const OrganizationEdit = () => {
  const [, setUploadUrl] = useState('');
  const [orgInfo, setOrgInfo] = useState<Organization>({
    logoURL: '',
    name: '',
    homepage: '',
    introduction: '',
  });

  const getInfo = async () => {
    const { data } = await getOrganizationInfo();
    setOrgInfo(data);
  };

  const updateInfo = async () => {
    await updateOrganizationInfo(orgInfo);
    message.success('上传成功！');
  };

  useEffect(() => {
    getInfo();
  }, []);

  const inputChang = (e: any) => {
    const val = (e.target as HTMLInputElement).value;
    setOrgInfo((values) => {
      return {
        ...values,
        name: val,
      };
    });
  };

  const customUpload = async (data: UploadRequestOption) => {
    try {
      const { url: avatarUrl } = await splitUpload(data.file as File);
      if (avatarUrl) {
        setUploadUrl(avatarUrl);
        await updateOrganizationInfo({ ...orgInfo, logoURL: avatarUrl });
        getInfo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Space direction="vertical">
          <Space direction="vertical" align="center">
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              src={orgInfo.logoURL}
            />
            <Upload accept="image/*" customRequest={customUpload} showUploadList={false}>
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Space>
          <div style={{ marginTop: '20px' }}>组织名称：</div>
          <Space>
            <Input value={orgInfo.name} onChange={inputChang} />
            <Button type={'primary'} onClick={() => updateInfo()}>
              保存
            </Button>
          </Space>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default OrganizationEdit;
