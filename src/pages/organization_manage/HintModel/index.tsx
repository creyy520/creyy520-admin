import { ACCOUNT_URL } from '@/config';
import {
  deleteDepartment,
  importByExcel,
  moveUserDepartment,
  removeMember,
} from '@/services/server/organization_manage';
import { resetUserPassword } from '@/services/server/user_manage';
import { FileExcelFilled, FileFilled } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Modal, Space, Upload } from 'antd';
import md5 from 'md5';
import { useState } from 'react';
import type { ModalType, MoveUserDepartment } from '../data';
import styles from './index.less';
import Shuttle from './Shuttle';

interface HintModelProps {
  type: ModalType;
  userID: string;
  departmentIdList: string[];
  selectedRowKeys: string[];
  setModalType: (type: ModalType) => void;
  resetSelectedRowKeys: () => void;
  init: () => void;
}

const HintModel = (props: HintModelProps) => {
  const {
    type,
    userID,
    departmentIdList,
    selectedRowKeys,
    setModalType,
    resetSelectedRowKeys,
    init,
  } = props;
  const departmentId = departmentIdList[0];

  // 调整部门
  const [targetDepartmentList, setTargetDepartmentList] = useState<string[]>([]);

  const onClose = () => {
    setModalType(undefined);
  };

  const DeleteDepartment = (
    <div>
      <p>删除后，该部门下的所有成员将不能看到组织信息，您确定要删除吗？</p>
      <br />
      <p className={styles.hint_text}>
        同时删除部门内用户账号（删除账号后，与该成员的相关记录都将删除）
      </p>
    </div>
  );

  const DeleteMember = (
    <div>
      <p>删除后，与该用户的相关记录都将删除，您确定要删除吗？</p>
    </div>
  );

  const RemoveUser = (
    <div>
      <p>您确定要将成员移出当前部门吗？</p>
    </div>
  );

  const ResetPassword = (
    <div>
      <p>您确定将该用户密码重置为系统默认密码吗？</p>
    </div>
  );

  const uploadProps: UploadProps = {
    maxCount: 1,
    action: ``,
    accept: '.xlsx',
    showUploadList: false,
    customRequest: async (options) => {
      await importByExcel(options.file as File);
      message.success('上传成功');
    },
  };

  const Import = (
    <div style={{ textAlign: 'center', height: '260px' }}>
      <Space size={'large'} style={{ height: '100%' }}>
        <Space direction="vertical" size={26}>
          <div>1、下载通讯录模板，填写成员信息</div>
          <div>
            <FileExcelFilled
              twoToneColor="#ebebeb"
              style={{
                fontSize: '3rem',
                color: '#ebebeb',
              }}
            />
          </div>
          <Button
            onClick={() => {
              window.open(`${ACCOUNT_URL}/organization/import/template`);
            }}
          >
            下载模板
          </Button>
        </Space>
        <div>-</div>
        <Space direction="vertical" size={26}>
          <div>2、上传填好的文件，导入成员信息</div>
          <div>
            <FileFilled
              twoToneColor="#ebebeb"
              style={{
                fontSize: '3rem',
                color: '#ebebeb',
              }}
            />
          </div>
          <Upload {...uploadProps}>
            <Button>上传文件</Button>
          </Upload>
        </Space>
      </Space>
    </div>
  );

  const ui = () => {
    switch (type) {
      case 'deleteDepartment':
        return {
          title: '删除部门', // departmentIDList []
          el: DeleteDepartment,
        };
      case 'deleteUser':
        return {
          title: '删除成员', // userIDList []
          el: DeleteMember,
        };
      case 'removeUser':
        return {
          title: '移出成员', // userID departmentID []
          el: RemoveUser,
        };
      case 'batchRemoveUser':
        return {
          title: '批量移除成员', // userID[]
          el: RemoveUser,
        };
      case 'resetPassword':
        return {
          title: '重置密码', // userID password
          el: ResetPassword,
        };
      case 'import':
        return {
          title: '批量导入', // userID password
          el: Import,
        };
      case 'shuttle':
        return {
          title: '调整部门', //
          el: (
            <Shuttle
              setTargetDepartmentList={setTargetDepartmentList}
              departmentId={departmentId}
            />
          ),
        };
      default:
        return {
          title: '',
          el: <></>,
        };
    }
  };

  const onOK = async () => {
    if (type === 'deleteDepartment') {
      try {
        await deleteDepartment(departmentIdList);
        init();
        message.success('删除成功！');
        onClose();
      } catch (error) {
        console.log(error);
        // message.error('删除部门失败，请重试！');
      }
    }
    // if (type === 'deleteUser') {
    //   try {
    //     await deleteMember(selectedRowKeys);
    //     message.success('删除成功！');
    //     resetSelectedRowKeys();
    //     onClose();
    //   } catch (error) {
    //     console.log(error);
    //     message.error('删除成员失败，请重试！');
    //   }
    // }
    if (type === 'resetPassword') {
      try {
        await resetUserPassword({
          userID,
          newPassword: md5('123456'),
        });
        message.success('密码已重置为123456！');
        onClose();
      } catch (error) {
        console.log(error);
        // message.error('重置密码失败，请重试！');
      }
    }
    if (type === 'removeUser') {
      try {
        await removeMember({ departmentID: departmentId, userID });
        message.success('移出成员成功！');
        resetSelectedRowKeys();
        onClose();
      } catch (error) {
        console.log(error);
        // message.error('移出成员失败，请重试！');
      }
    }
    if (type === 'batchRemoveUser') {
      try {
        const list = selectedRowKeys.map((item) => ({ departmentID: departmentId, userID: item }));
        await Promise.all(list.map((item) => removeMember(item)));
        message.success('移出成员成功！');
        resetSelectedRowKeys();
        onClose();
      } catch (error) {
        console.log(error);
        // message.error('移出成员失败，请重试！');
      }
    }
    if (type === 'shuttle') {
      try {
        const list: MoveUserDepartment[] = [];
        // 没选择当前部门 currentDepartmentID = departmentId
        // const hasSelectCurrent = targetDepartmentList.some((e) => e === departmentId);
        selectedRowKeys.forEach((user_ID) => {
          targetDepartmentList.forEach((depID) => {
            list.push({
              userID: user_ID,
              departmentID: depID,
              currentDepartmentID: departmentId,
            });
          });
        });
        await moveUserDepartment({ moves: list });
        message.success('调整部门成功！');
        resetSelectedRowKeys();
        onClose();
      } catch (error) {
        console.log(error);
        // message.error('调整部门失败，请重试！');
      }
    }
    if (type === 'import') {
      resetSelectedRowKeys();
      onClose();
    }
  };

  if (type === undefined) {
    return null;
  }

  return (
    <Modal
      title={ui().title}
      open={type !== undefined}
      onOk={onOK}
      onCancel={onClose}
      centered
      width={type === 'import' || type === 'shuttle' ? 700 : 420}
    >
      {ui().el}
    </Modal>
  );
};

export default HintModel;
