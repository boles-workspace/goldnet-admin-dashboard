'use client';

import { Card, Table, Tag, Space, Button, Progress } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';

export default function SubscriptionsPage() {
  const { current: language } = useAppSelector((state) => state.language);

  const translations = {
    en: {
      title: 'Subscriptions Management',
      organization: 'Organization',
      plan: 'Plan',
      status: 'Status',
      startDate: 'Start Date',
      endDate: 'End Date',
      daysLeft: 'Days Left',
      actions: 'Actions',
      view: 'View Details',
      active: 'Active',
      expired: 'Expired',
      pending: 'Pending',
      cancelled: 'Cancelled',
      days: 'days',
    },
    ar: {
      title: 'إدارة الاشتراكات',
      organization: 'المؤسسة',
      plan: 'الخطة',
      status: 'الحالة',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      daysLeft: 'الأيام المتبقية',
      actions: 'الإجراءات',
      view: 'عرض التفاصيل',
      active: 'نشط',
      expired: 'منتهي',
      pending: 'قيد الانتظار',
      cancelled: 'ملغي',
      days: 'يوم',
    },
  };

  const t = translations[language];

  // Sample data
  const subscriptions = [
    {
      key: '1',
      _id: '1',
      organizationName: 'Gold Traders Co.',
      planName: 'Professional Plan',
      status: 'ACTIVE',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      daysLeft: 299,
      progress: 18,
    },
    {
      key: '2',
      _id: '2',
      organizationName: 'Jewelry Workshop Ltd.',
      planName: 'Enterprise Plan',
      status: 'ACTIVE',
      startDate: '2026-02-01',
      endDate: '2027-01-31',
      daysLeft: 330,
      progress: 10,
    },
    {
      key: '3',
      _id: '3',
      organizationName: 'Supreme Jewelry Shop',
      planName: 'Basic Plan',
      status: 'ACTIVE',
      startDate: '2026-03-01',
      endDate: '2026-06-01',
      daysLeft: 86,
      progress: 7,
    },
    {
      key: '4',
      _id: '4',
      organizationName: 'Old Gold Shop',
      planName: 'Professional Plan',
      status: 'EXPIRED',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      daysLeft: 0,
      progress: 100,
    },
  ];

  const columns = [
    {
      title: t.organization,
      dataIndex: 'organizationName',
      key: 'organizationName',
    },
    {
      title: t.plan,
      dataIndex: 'planName',
      key: 'planName',
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ACTIVE: 'green',
          EXPIRED: 'red',
          PENDING: 'orange',
          CANCELLED: 'volcano',
        };
        return <Tag color={colorMap[status]}>{t[status.toLowerCase() as keyof typeof t] || status}</Tag>;
      },
      filters: [
        { text: t.active, value: 'ACTIVE' },
        { text: t.expired, value: 'EXPIRED' },
        { text: t.pending, value: 'PENDING' },
        { text: t.cancelled, value: 'CANCELLED' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: t.startDate,
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: t.endDate,
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: t.daysLeft,
      dataIndex: 'daysLeft',
      key: 'daysLeft',
      render: (days: number, record: any) => {
        if (record.status === 'EXPIRED') {
          return <Tag color="red">{t.expired}</Tag>;
        }
        const percent = Math.min(100, (days / 365) * 100);
        const color = percent > 50 ? 'green' : percent > 20 ? 'orange' : 'red';
        return (
          <div style={{ minWidth: 150 }}>
            <Progress
              percent={Math.round(percent)}
              size="small"
              status={percent < 20 ? 'exception' : 'normal'}
              strokeColor={color}
            />
            <div style={{ marginTop: 4, fontSize: 12 }}>
              {days} {t.days}
            </div>
          </div>
        );
      },
      sorter: (a: any, b: any) => a.daysLeft - b.daysLeft,
    },
    {
      title: t.actions,
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            // Navigate to subscription details
            console.log('View subscription:', record._id);
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
          <Table
            columns={columns}
            dataSource={subscriptions}
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
