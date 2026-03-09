'use client';

import { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Select, Modal, message } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';

const { Search } = Input;
const { Option } = Select;

export default function OrganizationsPage() {
  const { current: language } = useAppSelector((state) => state.language);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const translations = {
    en: {
      title: 'Organizations Management',
      search: 'Search organizations...',
      filterByStatus: 'Filter by Status',
      all: 'All',
      pending: 'Pending',
      active: 'Active',
      suspended: 'Suspended',
      rejected: 'Rejected',
      name: 'Name',
      email: 'Email',
      type: 'Type',
      status: 'Status',
      created: 'Created',
      actions: 'Actions',
      view: 'View',
      approve: 'Approve',
      reject: 'Reject',
      suspend: 'Suspend',
      details: 'Organization Details',
      phone: 'Phone',
      maxBranches: 'Max Branches',
      maxUsers: 'Max Users',
      close: 'Close',
      approveSuccess: 'Organization approved successfully',
      rejectSuccess: 'Organization rejected successfully',
    },
    ar: {
      title: 'إدارة المؤسسات',
      search: 'البحث عن المؤسسات...',
      filterByStatus: 'تصفية حسب الحالة',
      all: 'الكل',
      pending: 'قيد الانتظار',
      active: 'نشط',
      suspended: 'معلق',
      rejected: 'مرفوض',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      type: 'النوع',
      status: 'الحالة',
      created: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      view: 'عرض',
      approve: 'موافقة',
      reject: 'رفض',
      suspend: 'تعليق',
      details: 'تفاصيل المؤسسة',
      phone: 'الهاتف',
      maxBranches: 'أقصى عدد فروع',
      maxUsers: 'أقصى عدد مستخدمين',
      close: 'إغلاق',
      approveSuccess: 'تمت الموافقة على المؤسسة بنجاح',
      rejectSuccess: 'تم رفض المؤسسة بنجاح',
    },
  };

  const t = translations[language];

  // Sample data
  const organizations = [
    {
      key: '1',
      _id: '1',
      name: 'Gold Traders Co.',
      email: 'info@goldtraders.com',
      phone: '+20 123 456 7890',
      type: ['Gold Trader'],
      status: 'PENDING',
      maxBranches: 5,
      maxUsers: 20,
      createdAt: '2026-03-07',
    },
    {
      key: '2',
      _id: '2',
      name: 'Jewelry Workshop Ltd.',
      email: 'contact@jewelryworkshop.com',
      phone: '+20 123 456 7891',
      type: ['Jewelry Workshop'],
      status: 'ACTIVE',
      maxBranches: 3,
      maxUsers: 10,
      createdAt: '2026-03-06',
    },
    {
      key: '3',
      _id: '3',
      name: 'Supreme Jewelry Shop',
      email: 'info@supremejewelry.com',
      phone: '+20 123 456 7892',
      type: ['Jewelry Shop'],
      status: 'PENDING',
      maxBranches: 2,
      maxUsers: 5,
      createdAt: '2026-03-05',
    },
    {
      key: '4',
      _id: '4',
      name: 'Gold Distributor LLC',
      email: 'sales@golddistributor.com',
      phone: '+20 123 456 7893',
      type: ['Gold Distributor'],
      status: 'ACTIVE',
      maxBranches: 10,
      maxUsers: 50,
      createdAt: '2026-03-04',
    },
  ];

  const handleApprove = async (orgId: string) => {
    try {
      // API call would go here
      // await fetch(`http://localhost:3000/organizations/${orgId}/approve`, { method: 'PUT' })
      message.success(t.approveSuccess);
    } catch (error) {
      message.error('Failed to approve organization');
    }
  };

  const handleReject = async (orgId: string) => {
    try {
      // API call would go here
      message.success(t.rejectSuccess);
    } catch (error) {
      message.error('Failed to reject organization');
    }
  };

  const columns = [
    {
      title: t.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: t.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t.type,
      dataIndex: 'type',
      key: 'type',
      render: (types: string[]) => types.join(', '),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          PENDING: 'orange',
          ACTIVE: 'green',
          SUSPENDED: 'red',
          REJECTED: 'volcano',
        };
        return <Tag color={colorMap[status]}>{t[status.toLowerCase() as keyof typeof t] || status}</Tag>;
      },
      filters: [
        { text: t.pending, value: 'PENDING' },
        { text: t.active, value: 'ACTIVE' },
        { text: t.suspended, value: 'SUSPENDED' },
        { text: t.rejected, value: 'REJECTED' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: t.created,
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: t.actions,
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrg(record);
              setModalVisible(true);
            }}
          >
            {t.view}
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleApprove(record._id)}
              >
                {t.approve}
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record._id)}
              >
                {t.reject}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div>
        <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>{t.title}</h1>

        <Card>
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Search
              placeholder={t.search}
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
              allowClear
            />
          </Space>

          <Table
            columns={columns}
            dataSource={organizations}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `${language === 'en' ? 'Total' : 'المجموع'} ${total} ${language === 'en' ? 'items' : 'عنصر'}`,
            }}
          />
        </Card>

        <Modal
          title={t.details}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setModalVisible(false)}>
              {t.close}
            </Button>,
          ]}
          width={600}
        >
          {selectedOrg && (
            <div>
              <p><strong>{t.name}:</strong> {selectedOrg.name}</p>
              <p><strong>{t.email}:</strong> {selectedOrg.email}</p>
              <p><strong>{t.phone}:</strong> {selectedOrg.phone}</p>
              <p><strong>{t.type}:</strong> {selectedOrg.type.join(', ')}</p>
              <p><strong>{t.status}:</strong> <Tag color={selectedOrg.status === 'ACTIVE' ? 'green' : 'orange'}>{selectedOrg.status}</Tag></p>
              <p><strong>{t.maxBranches}:</strong> {selectedOrg.maxBranches}</p>
              <p><strong>{t.maxUsers}:</strong> {selectedOrg.maxUsers}</p>
              <p><strong>{t.created}:</strong> {selectedOrg.createdAt}</p>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
