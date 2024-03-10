/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'LineChartOutlined',
    component: './dashboard/Dashboard',
  },
  {
    path: '/business_system',
    name: 'BusinessSystem',
    icon: 'MedicineBoxOutlined',
    routes: [
      {
        path: '/business_system/register_manage',
        name: 'RegisterManage',
        routes: [
          {
            path: '/business_system/register_manage',
            redirect: '/business_system/register_manage/defualt_friends',
          },
          {
            name: 'DefualtFriends',
            path: '/business_system/register_manage/defualt_friends',
            component: './business_system/register_manage/DefualtFriends',
          },
          {
            name: 'DefualtGroup',
            path: '/business_system/register_manage/defualt_group',
            component: './business_system/register_manage/DefualtGroup',
          },
        ],
      },
      {
        path: '/business_system/log_manage',
        name: 'LogManage',
        routes: [
          {
            path: '/business_system/log_manage',
            redirect: '/business_system/log_manage/log_list',
          },
          {
            name: 'log_list',
            path: '/business_system/log_manage/log_list',
            component: './business_system/log_manage/LogList',
          },
        ],
      },
      {
        path: '/business_system/app_manage',
        name: 'AppManage',
        routes: [
          {
            path: '/business_system/app_manage',
            redirect: '/business_system/app_manage/discover_manage',
          },
          {
            name: 'DiscoveryPageManage',
            path: '/business_system/app_manage/discover_manage',
            component: './business_system/app_manage/DiscoveryPageManage',
          },
        ],
      },
    ],
  },
  {
    path: '/im_system',
    name: 'IMSyetem',
    icon: 'MessageOutlined',
    routes: [
      {
        path: '/im_system/user_manage',
        name: 'UserManage',
        routes: [
          {
            path: '/im_system/user_manage',
            redirect: '/im_system/user_manage/user_list',
          },
          {
            name: 'UserList',
            path: '/im_system/user_manage/user_list',
            component: './im_system/UserList',
          },
          {
            name: 'RelationList',
            path: '/im_system/user_manage/relation_list',
            component: './im_system/RelationList',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/im_system/group_manage',
        name: 'GroupManage',
        routes: [
          {
            path: '/im_system/group_manage',
            redirect: '/im_system/group_manage/group_list',
          },
          {
            name: 'GroupList',
            path: '/im_system/group_manage/group_list',
            component: './im_system/group_manage/GroupList',
          },
          {
            name: 'GroupMember',
            path: '/im_system/group_manage/group_member',
            component: './im_system/group_manage/GroupMember',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/im_system/message_manage',
        name: 'MessageManage',
        routes: [
          {
            path: '/im_system/message_manage',
            redirect: '/im_system/message_manage/user_message',
          },
          {
            name: 'UserMessage',
            path: '/im_system/message_manage/user_message',
            component: './im_system/message_manage/UserMessage',
          },
          {
            name: 'GroupMessage',
            path: '/im_system/message_manage/group_message',
            component: './im_system/message_manage/GroupMessage',
          },
        ],
      },
      {
        path: '/im_system/notification_manage',
        name: 'NotificationManage',
        routes: [
          {
            path: '/im_system/notification_manage',
            redirect: '/im_system/notification_manage/account_list',
          },
          {
            name: 'NotificationAccountList',
            path: '/im_system/notification_manage/account_list',
            component: './im_system/notification_manage/NotificationAccountList',
          },
          {
            name: 'PublishNotification',
            path: '/im_system/notification_manage/publish_notification',
            component: './im_system/notification_manage/PublishNotification',
          },
        ],
      },
    ],
  },
  {
    path: '/organization_manage',
    name: 'OrganizationManage',
    icon: 'apartment',
    routes: [
      {
        path: '/organization_manage',
        redirect: '/organization_manage/organization_list',
      },
      {
        name: 'OrganizationList',
        path: '/organization_manage/organization_list',
        component: './organization_manage/OrganizationList',
      },
      {
        name: 'OrganizationEdit',
        path: '/organization_manage/organization_edit',
        component: './organization_manage/OrganizationEdit',
      },
    ],
  },
  {
    path: '/rtc_system',
    name: 'RtcSystem',
    icon: 'VideoCameraOutlined',
    routes: [
      {
        path: '/rtc_system',
        redirect: '/rtc_system/video_call',
      },
      {
        name: 'Meeting',
        path: '/rtc_system/meeting',
        component: './rtc_system/Meeting',
      },
      {
        name: 'VideoCall',
        path: '/rtc_system/video_call',
        component: './rtc_system/VideoCall',
      },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    icon: 'setting',
    routes: [
      {
        path: '/profile',
        redirect: '/profile/admin_info',
      },
      {
        name: 'AdminInfo',
        path: '/profile/admin_info',
        component: './profile',
      },
      {
        name: 'AdminPassword',
        path: '/profile/admin_password',
        component: './profile/Password',
      },
    ],
  },
  {
    path: '/',
    redirect: '/organization_manage/organization_list',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
