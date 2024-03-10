import type { UserListItem } from '@/pages/business_system/user_manage/data';
import { getUserList } from '@/services/server/user_manage';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Checkbox, Col, FormInstance, Input, message, Row, Select, Tag } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  batchSendNotification,
  getNotificationAccounts,
} from '@/services/server/notification_manage';
import { DefaultAvatar, defaultAvatarStr } from '@/utils/avatar';
import { NotificationAccount } from './data';
import styles from './style.less';

export type SelectedRowDataItem = Record<
  number,
  {
    keys: React.Key[];
    items: UserListItem[];
  }
>;

const PublishNotification = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [selectedRowData, setSelectedRowData] = useState({} as SelectedRowDataItem);
  const [allSend, setAllSend] = useState(false);
  const [current, setCurrent] = useState(1);
  const [content, setContent] = useState('');
  const [accounts, setAccounts] = useState([] as NotificationAccount[]);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getAccounts();
  }, []);

  const columns: ProColumns<UserListItem>[] = useMemo(
    () => [
      {
        title: '用户头像',
        dataIndex: 'faceURL',
        valueType: 'avatar',
        key: 'faceURL',
        hideInSearch: true,
        align: 'center',
        render(_, record) {
          return <DefaultAvatar faceURL={record.faceURL} nickname={record.nickname} />;
        },
      },
      {
        title: '昵称',
        key: 'nickname',
        dataIndex: 'nickname',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '用户ID',
        key: 'userID',
        dataIndex: 'userID',
        align: 'center',
      },
    ],
    [],
  );

  const getAccounts = () => {
    getNotificationAccounts({
      pagination: {
        pageNumber: 1,
        showNumber: 100,
      },
    }).then((res) => {
      setAccounts(res.data.notificationAccounts ?? []);
    });
  };

  const onSelectChange = (keys: React.Key[], items: UserListItem[]) => {
    const tmpData = { ...selectedRowData };
    tmpData[actionRef.current!.pageInfo!.current] = {
      keys,
      items,
    };
    console.log(keys, tmpData);
    setSelectedRowData(tmpData);
  };

  const getItems = useMemo(
    () =>
      Object.values(selectedRowData)
        .map((data) => data.items)
        .flat(),
    [selectedRowData],
  );

  const onCancelSelect = (value: string) => {
    const tmpData = { ...selectedRowData };
    // eslint-disable-next-line guard-for-in
    for (const key in tmpData) {
      const keyIdx = tmpData[key].keys.findIndex((k) => k === value);
      const itemdIdx = tmpData[key].items.findIndex((item) => item.userID === value);
      if (keyIdx !== -1 && itemdIdx !== -1) {
        tmpData[key].keys.splice(keyIdx, 1);
        tmpData[key].items.splice(itemdIdx, 1);
      }
    }
    setSelectedRowData(tmpData);
    setCurrent(current + 1);
    setTimeout(() => setCurrent(actionRef.current!.pageInfo!.current));
  };

  const send2User = () => {
    if (!selectedAccount) {
      message.warning('请选择通知账号！');
      return;
    }
    setSending(true);
    batchSendNotification({
      sendID: selectedAccount,
      isSendAll: allSend,
      recvIDList: getItems.map((item) => item.userID),
      text: content,
    })
      .then(() => {
        setSelectedRowData([]);
        setContent('');
        message.success('发送成功！');
      })
      .finally(() => setSending(false));
  };

  return (
    <PageContainer>
      <Row>
        <Col span={13} xxl={15}>
          <div className="pb-3">
            <div className="font-medium mb-2">通知账号</div>
            <Select
              value={selectedAccount}
              onSelect={(v) => setSelectedAccount(v)}
              className="w-[120px]"
              placeholder="请选择"
            >
              {accounts.map((account) => (
                <Select.Option value={account.userID}>{account.nickName}</Select.Option>
              ))}
            </Select>
          </div>

          <div className="font-medium">接收用户</div>
          <div className="w-full bg-white h-[120px] mt-3 mb-8 p-2 rounded-lg overflow-auto custom_scrollbar">
            {getItems.map((user) => (
              <Tag key={user.userID} closable onClose={() => onCancelSelect(user.userID)}>
                {user.nickname}
              </Tag>
            ))}
          </div>

          <div>
            <div className="font-medium">消息内容</div>
            <div className="w-full bg-white h-[350px] mt-3 py-1 rounded-lg relative px-3">
              <Input.TextArea
                className={styles.send_content}
                placeholder="请输入群发内容"
                autoSize={{ maxRows: 8, minRows: 8 }}
                bordered={false}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                showCount
                maxLength={500}
              />
              <Button
                loading={sending}
                onClick={send2User}
                className="!absolute right-5 bottom-8 px-6"
                type="primary"
              >
                发送
              </Button>
            </div>
            <Checkbox
              checked={allSend}
              onChange={(e) => setAllSend(e.target.checked)}
              className="mt-4"
            >
              发送给所有已注册用户
            </Checkbox>
          </div>
        </Col>
        <Col className={styles.send_user_table} offset={1} span={10} xxl={8}>
          <ProTable<UserListItem>
            search={{
              optionRender: false,
            }}
            columns={columns}
            rowSelection={{
              // @ts-ignore
              selectedRowKeys: selectedRowData[current]?.keys ?? [],
              onChange: onSelectChange,
            }}
            tableAlertRender={false}
            tableAlertOptionRender={false}
            actionRef={actionRef}
            formRef={formRef}
            columnsState={{
              defaultValue: {
                option: {
                  fixed: 'right',
                },
              },
              persistenceKey: 'user_table_insearch',
              persistenceType: 'sessionStorage',
            }}
            request={async (params = {}, sort, filter) => {
              console.log(params, sort, filter);
              const { data } = await getUserList({
                keyword: params.userID ?? '',
                pagination: {
                  pageNumber: params.current as number,
                  showNumber: params.pageSize as number,
                },
              });
              const tmpData = data.users ?? [];
              tmpData.forEach((user: UserListItem, idx: number) => {
                user.index = idx;
                user.avatar = defaultAvatarStr(user.faceURL);
              });
              return {
                data: tmpData,
                success: true,
                total: data.total,
              };
            }}
            rowKey="userID"
            pagination={{
              pageSize: 10,
              onChange: (page) => {
                console.log(page);
                setCurrent(page);
              },
              showSizeChanger: false,
            }}
            dateFormatter="string"
            scroll={{ x: 'max-content' }}
            toolbar={{
              actions: [],
              settings: [],
            }}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default PublishNotification;
