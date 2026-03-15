'use client';

import { Card, Row, Col, Statistic, Table, Tag, Space } from 'antd';
import {
  TeamOutlined,
  CreditCardOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import AuthGuard from '@/middleware/AuthGuard';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const { current: language } = useAppSelector((state) => state.language);

  const translations = {
    en: {
      title: 'Dashboard Overview',
      totalOrganizations: 'Total Organizations',
      activeSubscriptions: 'Active Subscriptions',
      pendingPayments: 'Pending Payments',
      totalRevenue: 'Total Revenue',
      recentActivity: 'Recent Activity',
      recentOrganizations: 'Recent Organizations',
      name: 'Name',
      status: 'Status',
      type: 'Type',
      date: 'Date',
      pending: 'Pending',
      active: 'Active',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    ar: {
      title: 'نظرة عامة على لوحة التحكم',
      totalOrganizations: 'إجمالي المؤسسات',
      activeSubscriptions: 'الاشتراكات النشطة',
      pendingPayments: 'المدفوعات المعلقة',
      totalRevenue: 'إجمالي الإيرادات',
      recentActivity: 'النشاط الأخير',
      recentOrganizations: 'المؤسسات الأخيرة',
      name: 'الاسم',
      status: 'الحالة',
      type: 'النوع',
      date: 'التاريخ',
      pending: 'قيد الانتظار',
      active: 'نشط',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
    },
  };

  const t = translations[language];

  // Sample data
  const recentOrganizations = [
    {
      key: '1',
      name: 'Gold Traders Co.',
      status: 'PENDING',
      type: 'Gold Trader',
      date: '2026-03-07',
    },
    {
      key: '2',
      name: 'Jewelry Workshop Ltd.',
      status: 'ACTIVE',
      type: 'Jewelry Workshop',
      date: '2026-03-06',
    },
    {
      key: '3',
      name: 'Supreme Jewelry Shop',
      status: 'PENDING',
      type: 'Jewelry Shop',
      date: '2026-03-05',
    },
  ];

  const columns = [
    {
      title: t.name,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'ACTIVE' ? 'green' : status === 'PENDING' ? 'orange' : 'red';
        return <Tag color={color}>{t[status.toLowerCase() as keyof typeof t] || status}</Tag>;
      },
    },
    {
      title: t.type,
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t.date,
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <AuthGuard>
      <MainLayout>
        <div className="dashboard-overview">
        <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>{t.title}</h1>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t.totalOrganizations}
                value={124}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#3f8600' }}
                suffix={<ArrowUpOutlined style={{ fontSize: 14 }} />}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                +12% {language === 'en' ? 'from last month' : 'من الشهر الماضي'}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t.activeSubscriptions}
                value={98}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                +8% {language === 'en' ? 'from last month' : 'من الشهر الماضي'}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t.pendingPayments}
                value={15}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                {language === 'en' ? 'Requires attention' : 'يحتاج إلى اهتمام'}
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title={t.totalRevenue}
                value={1256780}
                prefix={<DollarOutlined />}
                suffix="EGP"
                valueStyle={{ color: '#52c41a' }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
                +24% {language === 'en' ? 'from last month' : 'من الشهر الماضي'}
              </div>
            </Card>
          </Col>
        </Row>

        <Card
          title={t.recentOrganizations}
          style={{ marginTop: 24 }}
          extra={
            <a href="/organizations">
              {language === 'en' ? 'View All' : 'عرض الكل'}
            </a>
          }
        >
          <Table
            columns={columns}
            dataSource={recentOrganizations}
            pagination={false}
            size="middle"
          />
        </Card>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
