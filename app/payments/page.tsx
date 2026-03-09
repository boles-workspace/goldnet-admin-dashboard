'use client';

import { useState } from 'react';
import { Card, Table, Tag, Space, Button, Modal, Image, message, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';

const { Search } = Input;

export default function PaymentsPage() {
  const { current: language } = useAppSelector((state) => state.language);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);

  const translations = {
    en: {
      title: 'Payments Management',
      search: 'Search payments...',
      organization: 'Organization',
      plan: 'Plan',
      amount: 'Amount',
      status: 'Status',
      submitted: 'Submitted',
      actions: 'Actions',
      view: 'View',
      approve: 'Approve',
      reject: 'Reject',
      viewReceipt: 'View Receipt',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      details: 'Payment Details',
      receiptImage: 'Receipt Image',
      close: 'Close',
      approveSuccess: 'Payment approved successfully',
      rejectSuccess: 'Payment rejected successfully',
      reviewedBy: 'Reviewed By',
      reviewedAt: 'Reviewed At',
    },
    ar: {
      title: 'إدارة المدفوعات',
      search: 'البحث عن المدفوعات...',
      organization: 'المؤسسة',
      plan: 'الخطة',
      amount: 'المبلغ',
      status: 'الحالة',
      submitted: 'تاريخ التقديم',
      actions: 'الإجراءات',
      view: 'عرض',
      approve: 'موافقة',
      reject: 'رفض',
      viewReceipt: 'عرض الإيصال',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      details: 'تفاصيل الدفع',
      receiptImage: 'صورة الإيصال',
      close: 'إغلاق',
      approveSuccess: 'تمت الموافقة على الدفع بنجاح',
      rejectSuccess: 'تم رفض الدفع بنجاح',
      reviewedBy: 'تمت المراجعة بواسطة',
      reviewedAt: 'تاريخ المراجعة',
    },
  };

  const t = translations[language];

  // Sample data
  const payments = [
    {
      key: '1',
      _id: '1',
      organizationName: 'Gold Traders Co.',
      planName: 'Professional Plan',
      amount: 15000,
      status: 'PENDING',
      receiptUrl: 'https://via.placeholder.com/600x800/1890ff/ffffff?text=Receipt+1',
      submittedAt: '2026-03-07',
    },
    {
      key: '2',
      _id: '2',
      organizationName: 'Jewelry Workshop Ltd.',
      planName: 'Enterprise Plan',
      amount: 25000,
      status: 'APPROVED',
      receiptUrl: 'https://via.placeholder.com/600x800/52c41a/ffffff?text=Receipt+2',
      submittedAt: '2026-03-06',
      reviewedAt: '2026-03-06',
      reviewedBy: 'Admin User',
    },
    {
      key: '3',
      _id: '3',
      organizationName: 'Supreme Jewelry Shop',
      planName: 'Basic Plan',
      amount: 8000,
      status: 'PENDING',
      receiptUrl: 'https://via.placeholder.com/600x800/faad14/ffffff?text=Receipt+3',
      submittedAt: '2026-03-05',
    },
  ];

  const handleApprove = async (paymentId: string) => {
    try {
      // API call would go here
      // await fetch(`http://localhost:3000/payments/${paymentId}/approve`, { method: 'PUT' })
      message.success(t.approveSuccess);
    } catch (error) {
      message.error('Failed to approve payment');
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      // API call would go here
      message.success(t.rejectSuccess);
    } catch (error) {
      message.error('Failed to reject payment');
    }
  };

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
      title: t.amount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount.toLocaleString()} EGP`,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          PENDING: 'orange',
          APPROVED: 'green',
          REJECTED: 'red',
        };
        return <Tag color={colorMap[status]}>{t[status.toLowerCase() as keyof typeof t] || status}</Tag>;
      },
      filters: [
        { text: t.pending, value: 'PENDING' },
        { text: t.approved, value: 'APPROVED' },
        { text: t.rejected, value: 'REJECTED' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: t.submitted,
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      sorter: (a: any, b: any) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
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
              setSelectedPayment(record);
              setModalVisible(true);
            }}
          >
            {t.view}
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedPayment(record);
              setReceiptVisible(true);
            }}
          >
            {t.viewReceipt}
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
          <Search
            placeholder={t.search}
            prefix={<SearchOutlined />}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />

          <Table
            columns={columns}
            dataSource={payments}
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
          {selectedPayment && (
            <div>
              <p><strong>{t.organization}:</strong> {selectedPayment.organizationName}</p>
              <p><strong>{t.plan}:</strong> {selectedPayment.planName}</p>
              <p><strong>{t.amount}:</strong> {selectedPayment.amount.toLocaleString()} EGP</p>
              <p><strong>{t.status}:</strong> <Tag color={selectedPayment.status === 'APPROVED' ? 'green' : selectedPayment.status === 'PENDING' ? 'orange' : 'red'}>{selectedPayment.status}</Tag></p>
              <p><strong>{t.submitted}:</strong> {selectedPayment.submittedAt}</p>
              {selectedPayment.reviewedAt && (
                <>
                  <p><strong>{t.reviewedAt}:</strong> {selectedPayment.reviewedAt}</p>
                  <p><strong>{t.reviewedBy}:</strong> {selectedPayment.reviewedBy}</p>
                </>
              )}
            </div>
          )}
        </Modal>

        <Modal
          title={t.receiptImage}
          open={receiptVisible}
          onCancel={() => setReceiptVisible(false)}
          footer={[
            <Button key="close" onClick={() => setReceiptVisible(false)}>
              {t.close}
            </Button>,
          ]}
          width={700}
        >
          {selectedPayment && (
            <div style={{ textAlign: 'center' }}>
              <Image
                src={selectedPayment.receiptUrl}
                alt="Payment Receipt"
                style={{ maxWidth: '100%' }}
              />
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
}
