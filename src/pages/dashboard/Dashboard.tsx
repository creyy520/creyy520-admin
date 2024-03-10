import { FullscreenOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { FloatButton } from 'antd';
import { useRef } from 'react';

const Dashboard = () => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const toogleFullScreen = () => {
    if (iframe.current?.requestFullscreen) {
      iframe.current?.requestFullscreen();
    } else if (iframe.current?.webkitRequestFullscreen) {
      /* Safari */
      iframe.current?.webkitRequestFullscreen();
    }
  };
  return (
    <PageContainer pageHeaderRender={() => null} className="dashboard-page">
      <div style={{ height: 'calc(100vh - 56px)' }}>
        <iframe ref={iframe} src="https://grafana.blooming.cool" width="100%" height="100%" />
      </div>
      <FloatButton icon={<FullscreenOutlined />} onClick={toogleFullScreen} />
    </PageContainer>
  );
};

export default Dashboard;
