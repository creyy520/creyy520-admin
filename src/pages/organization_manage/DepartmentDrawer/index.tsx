import { createDepartment, updateDepartment } from '@/services/server/organization_manage';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Drawer, Form, message } from 'antd';
import type { Key } from 'antd/es/table/interface';
import { useEffect } from 'react';
import type { DepartmentDrawerType } from '../data';

type OrgDepartmentDrawerProps = {
  type: DepartmentDrawerType;
  departmentName: string;
  departmentIdList: Key[];
  setDepDrawer: (type: DepartmentDrawerType) => void;
};

// 创建部门、编辑部门
const OrgDepartmentDrawer = (props: OrgDepartmentDrawerProps) => {
  const { type, departmentName, departmentIdList, setDepDrawer } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (type) {
      form.setFieldsValue({
        departmentName,
      });
    }
  }, [type]);

  const onClose = () => {
    setDepDrawer(undefined);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    if (type === 'create') {
      try {
        await createDepartment({
          name: values.name,
          parentDepartmentID: String(departmentIdList[0] ?? ''),
        });
        message.success('添加成功！');
        onClose();
      } catch (error) {
        console.log(error);
        message.error('创建部门失败，请重试！');
      }
    }
    if (type === 'edit') {
      try {
        await updateDepartment({ name: values.name, departmentID: String(departmentIdList[0]) });
        message.success('编辑成功！');
        onClose();
      } catch (error) {
        console.log(error);
        message.error('编辑部门失败，请重试！');
      }
    }
  };

  const titleType = type === 'create' ? '创建部门' : '修改部门';

  return (
    <Drawer title={titleType} placement="right" onClose={onClose} open={type !== undefined}>
      <ProForm
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
        form={form}
        layout="horizontal"
        onFinish={onFinish}
      >
        <ProFormText name="departmentName" label={type === 'create' ? '上级' : '名称'} disabled />
        <ProFormText name="name" label="名称" />
      </ProForm>
    </Drawer>
  );
};

export default OrgDepartmentDrawer;
