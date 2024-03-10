import { PlatformTypeOptions } from '@/constants/platformTypeOptions';
import { deleteLog, getLogs } from '@/services/server/log_manage';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Space } from 'antd';
import Popconfirm from 'antd/es/popconfirm';
import moment from 'moment';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogItem } from './data';

const LogList = () => {
  const actionRef = useRef<ActionType>();

  const deleteLogs = async (record: LogItem) => {
    deleteLog([record.logID]).then(() => {
      message.success('删除成功！');
      actionRef.current?.reload();
    });
    // .catch(() => message.error('撤回失败！'));
  };

  const columns: ProColumns<LogItem>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      valueType: 'indexBorder',
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'userID',
      align: 'center',
      search: {
        transform: (value: any) => ({
          keyword: value,
        }),
      },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '系统型号',
      dataIndex: 'systemType',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '版本号',
      dataIndex: 'version',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '发送平台',
      dataIndex: 'platform',
      align: 'center',
      valueType: 'select',
      request: async () => PlatformTypeOptions,
      hideInSearch: true,
    },
    // {
    //   title: '文件名称',
    //   dataIndex: 'filename',
    //   align: 'center',
    //   hideInSearch: true,
    //   render(_, record) {
    //     return (
    //       <Typography.Text ellipsis={{ tooltip: record.filename }} style={{ width: '100px' }}>
    //         {record.filename}
    //       </Typography.Text>
    //     );
    //   },
    // },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createdAtRange',
      valueType: 'dateTimeRange',
      align: 'center',
      search: {
        transform: (value: any) => ({
          startTime: new Date(value[0]).getTime(),
          endTime: new Date(value[1]).getTime(),
        }),
      },
      render(_, entity) {
        return moment(entity.createTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (_, record) => {
        return (
          <Space>
            <a href={record.url} download={record.filename}>
              下载
            </a>
            <Popconfirm
              key="delete"
              title="确定要删除这个日志吗？"
              onConfirm={() => deleteLogs(record)}
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<LogItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        columnsState={{
          defaultValue: {
            option: {
              fixed: 'right',
            },
          },
        }}
        request={async (params: any, sort, filter) => {
          console.log(params, sort, filter);
          const { data } = await getLogs({
            ...params,
            pagination: {
              pageNumber: params.current as number,
              showNumber: params.pageSize as number,
            },
          });
          return {
            data: data.logsInfos ?? [],
            success: true,
            total: data.total,
          };
        }}
        editable={{
          type: 'multiple',
          actionRender: (row, config, doms) => {
            return [doms.save, doms.cancel];
          },
          // onSave: (key, record) => {
          //   return updateMerchant(record);
          // },
        }}
        rowKey={() => uuidv4()}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        scroll={{ x: 'max-content' }}
        toolbar={{
          actions: [],
          settings: [],
        }}
      />
    </PageContainer>
  );
};

export default LogList;
