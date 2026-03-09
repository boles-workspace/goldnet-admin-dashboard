'use client';

import { Card, Table, Tag, Space, Button, Input } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';

const { Search } = Input;

export default function UsersPage() {
  const { current: language } = useAppSelector((state) => state.language);

  const translations = {
    en: {
      title: 'Users Management',
      search: 'Search users...',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      organization: 'Organization',
      status: 'Status',
      lastLogin: 'Last Login',
      actions: 'Actions',
      view: 'View',
      active: 'Active',
      inactive: 'Inactive',
      superAdmin: 'Super Admin',
      admin: 'Admin',
      organizationOwner: 'Organization Owner',
      organizationUser: 'Organization User',
      branchUser: 'Branch User',
    },
    ar: {
      title: 'إدارة المستخدمين',
      search: 'البحث عن المستخدمين...',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      organization: 'المؤسسة',
      status: 'الحالة',
      lastLogin: 'آخر تسجيل دخول',
      actions: 'الإجراءات',
      view: 'عرض',
      active: 'نشط',
      inactive: 'غير نشط',
      superAdmin: 'مدير نظام',
      admin: 'مدير',
      organizationOwner: 'مالك المؤسسة',
      organizationUser: 'مستخدم المؤسسة',
      branchUser: 'مستخدم الفرع',
    },
  };

  const t = translations[language];

  const roleTranslations: Record<string, string> = {
    'SUPER_ADMIN': t.superAdmin,
    'ADMIN': t.admin,
    'ORGANIZATION_OWNER': t.organizationOwner,
    'ORGANIZATION_USER': t.organizationUser,
    'BRANCH_USER': t.branchUser,
  };

  // Sample data
  const users = [
    {
      key: '1',
      _id: '1',
      firstName: 'Ahmed',
      lastName: 'Mohamed',
      email: 'ahmed@goldtraders.com',
      role: 'ORGANIZATION_OWNER',
      organizationName: 'Gold Traders Co.',
      status: 'ACTIVE',
      lastLogin: '2026-03-07 10:30',
    },
    {
      key: '2',
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Ali',
      email: 'sarah@jewelryworkshop.com',
      role: 'ORGANIZATION_OWNER',
      organizationName: 'Jewelry Workshop Ltd.',
      status: 'ACTIVE',
      lastLogin: '2026-03-07 09:15',
    },
    {
      key: '3',
      _id: '3',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@goldnet.com',
      role: 'SUPER_ADMIN',
      organizationName: '-',
      status: 'ACTIVE',
      lastLogin: '2026-03-07 11:00',
    },
    {
      key: '4',
      _id: '4',
      firstName: 'Mohamed',
      lastName: 'Hassan',
      email: 'mohamed@supremejewelry.com',
      role: 'ORGANIZATION_USER',
      organizationName: 'Supreme Jewelry Shop',
      status: 'ACTIVE',
      lastLogin: '2026-03-06 16:45',
    },
  ];

  const columns = [
    {
      title: t.name,
      key: 'name',
      render: (_: any, record: any) => `${record.firstName} ${record.lastName}`,
      sorter: (a: any, b: any) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: t.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t.role,
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          SUPER_ADMIN: 'red',
          ADMIN: 'volcano',
          ORGANIZATION_OWNER: 'blue',
          ORGANIZATION_USER: 'cyan',
          BRANCH_USER: 'green',
        };
        return <Tag color={colorMap[role]}>{roleTranslations[role] || role}</Tag>;
      },
      filters: [
        { text: t.superAdmin, value: 'SUPER_ADMIN' },
        { text: t.admin, value: 'ADMIN' },
        { text: t.organizationOwner, value: 'ORGANIZATION_OWNER' },
        { text: t.organizationUser, value: 'ORGANIZATION_USER' },
        { text: t.branchUser, value: 'BRANCH_USER' },
      ],
      onFilter: (value: any, record: any) => record.role === value,
    },
    {
      title: t.organization,
      dataIndex: 'organizationName',
      key: 'organizationName',
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {t[status.toLowerCase() as keyof typeof t] || status}
        </Tag>
      ),
    },
    {
      title: t.lastLogin,
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a: any, b: any) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
    },
    {
      title: t.actions,
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            console.log('View user:', record._id);
          }}
        >
          {t.view}
        </Button>
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>{t.title}</h1>

        <Card>
          <Search
            placeholder={t.search}
            prefix={<SearchOutlined />}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />

          <Table
            columns={columns}
            dataSource={users}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${language === 'en' ? 'Total' : 'المجموع'} ${total} ${language === 'en' ? 'items' : 'عنصر'}`,
            }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
