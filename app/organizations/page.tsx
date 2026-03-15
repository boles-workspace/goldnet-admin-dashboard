'use client';

import { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Modal, message, Descriptions, Image, Spin } from 'antd';
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined, DatabaseOutlined, FileImageOutlined } from '@ant-design/icons';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';
import {
  useListOrganizationsQuery,
  useApproveOrganizationMutation,
  useProvisionTenantMutation,
  type Organization,
} from '@/store/api/organizationApi';

const { Search, TextArea } = Input;

export default function OrganizationsPage() {
  const { current: language } = useAppSelector((state) => state.language);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  // API hooks
  const { data: organizationsData, isLoading, refetch } = useListOrganizationsQuery({ status: statusFilter });
  const [approveOrganization, { isLoading: isApproving }] = useApproveOrganizationMutation();
  const [provisionTenant, { isLoading: isProvisioning }] = useProvisionTenantMutation();

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
      approveConfirm: 'Approve Organization',
      approveMessage: 'Are you sure you want to approve this organization? This will activate their account and move their payment receipt to permanent storage.',
      rejectConfirm: 'Reject Organization',
      rejectMessage: 'Please provide a reason for rejection:',
      rejectionReasonPlaceholder: 'Enter rejection reason...',
      cancel: 'Cancel',
      confirm: 'Confirm',
      provisionDatabase: 'Provision Database',
      provisionSuccess: 'Database provisioned successfully',
      provisionConfirm: 'Provision Tenant Database',
      provisionMessage: 'This will create a dedicated database for this organization with all necessary tables and seed data. Continue?',
      owner: 'Owner',
      plan: 'Plan',
      billingCycle: 'Billing Cycle',
      totalPrice: 'Total Price',
      transactionRef: 'Transaction Reference',
      receipt: 'Payment Receipt',
      slug: 'Slug',
      tenantId: 'Tenant ID',
      approved: 'Approved',
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
      approveConfirm: 'الموافقة على المؤسسة',
      approveMessage: 'هل أنت متأكد من الموافقة على هذه المؤسسة؟ سيتم تفعيل حسابهم ونقل إيصال الدفع إلى التخزين الدائم.',
      rejectConfirm: 'رفض المؤسسة',
      rejectMessage: 'يرجى تقديم سبب الرفض:',
      rejectionReasonPlaceholder: 'أدخل سبب الرفض...',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      provisionDatabase: 'إنشاء قاعدة البيانات',
      provisionSuccess: 'تم إنشاء قاعدة البيانات بنجاح',
      provisionConfirm: 'إنشاء قاعدة بيانات المستأجر',
      provisionMessage: 'سيتم إنشاء قاعدة بيانات مخصصة لهذه المؤسسة مع جميع الجداول والبيانات الأولية. متابعة؟',
      owner: 'المالك',
      plan: 'الخطة',
      billingCycle: 'دورة الفوترة',
      totalPrice: 'السعر الإجمالي',
      transactionRef: 'رقم المعاملة',
      receipt: 'إيصال الدفع',
      slug: 'المعرف',
      tenantId: 'معرف المستأجر',
      approved: 'مُوافق عليه',
    },
  };

  const t = translations[language];

  const organizations = organizationsData?.data || [];

  const handleApprove = async (org: Organization) => {
    setSelectedOrg(org);
    setApproveModalVisible(true);
  };

  const confirmApprove = async () => {
    if (!selectedOrg) return;

    try {
      await approveOrganization({
        id: selectedOrg._id,
        data: { status: 'APPROVED' },
      }).unwrap();

      message.success(t.approveSuccess);
      setApproveModalVisible(false);
      setSelectedOrg(null);
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to approve organization');
    }
  };

  const handleReject = async (org: Organization) => {
    setSelectedOrg(org);
    setRejectModalVisible(true);
    setRejectionReason('');
  };

  const confirmReject = async () => {
    if (!selectedOrg || !rejectionReason.trim()) {
      message.error('Please provide a rejection reason');
      return;
    }

    try {
      await approveOrganization({
        id: selectedOrg._id,
        data: { status: 'REJECTED', rejectionReason },
      }).unwrap();

      message.success(t.rejectSuccess);
      setRejectModalVisible(false);
      setSelectedOrg(null);
      setRejectionReason('');
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to reject organization');
    }
  };

  const handleProvisionDatabase = async (org: Organization) => {
    Modal.confirm({
      title: t.provisionConfirm,
      content: t.provisionMessage,
      okText: t.confirm,
      cancelText: t.cancel,
      onOk: async () => {
        try {
          await provisionTenant(org._id).unwrap();
          message.success(t.provisionSuccess);
          refetch();
        } catch (error: any) {
          message.error(error?.data?.message || 'Failed to provision database');
        }
      },
    });
  };

  const columns = [
    {
      title: t.name,
      dataIndex: 'nameEn',
      key: 'nameEn',
      sorter: (a: Organization, b: Organization) => a.nameEn.localeCompare(b.nameEn),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: any, record: Organization) =>
        record.nameEn.toLowerCase().includes(value.toLowerCase()) ||
        record.nameAr.toLowerCase().includes(value.toLowerCase()) ||
        record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: t.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t.type,
      dataIndex: 'types',
      key: 'types',
      render: (types: string[]) => types.map(t => t.replace('_', ' ')).join(', '),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'orange',
          approved: 'blue',
          active: 'green',
          suspended: 'red',
          rejected: 'volcano',
          expired: 'default',
          cancelled: 'default',
        };
        return <Tag color={colorMap[status.toLowerCase()]}>{t[status.toLowerCase() as keyof typeof t] || status.toUpperCase()}</Tag>;
      },
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
      render: (_: any, record: Organization) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrg(record);
              setDetailsModalVisible(true);
            }}
          >
            {t.view}
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                style={{ color: 'green' }}
                onClick={() => handleApprove(record)}
              >
                {t.approve}
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record)}
              >
                {t.reject}
              </Button>
            </>
          )}
          {record.status === 'approved' && !record.activatedAt && (
            <Button
              type="link"
              icon={<DatabaseOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handleProvisionDatabase(record)}
              loading={isProvisioning}
            >
              {t.provisionDatabase}
            </Button>
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
              onSearch={setSearchText}
              onChange={(e) => !e.target.value && setSearchText('')}
            />
          </Space>

          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={organizations.map(org => ({ ...org, key: org._id }))}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `${language === 'en' ? 'Total' : 'المجموع'} ${total} ${language === 'en' ? 'items' : 'عنصر'}`,
              }}
            />
          </Spin>
        </Card>

        {/* Details Modal */}
        <Modal
          title={t.details}
          open={detailsModalVisible}
          onCancel={() => setDetailsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDetailsModalVisible(false)}>
              {t.close}
            </Button>,
          ]}
          width={800}
        >
          {selectedOrg && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t.name} span={2}>{language === 'en' ? selectedOrg.nameEn : selectedOrg.nameAr}</Descriptions.Item>
              <Descriptions.Item label={t.slug}>{selectedOrg.slug}</Descriptions.Item>
              <Descriptions.Item label={t.tenantId}>{selectedOrg.tenantId}</Descriptions.Item>
              <Descriptions.Item label={t.email}>{selectedOrg.email}</Descriptions.Item>
              <Descriptions.Item label={t.phone}>{selectedOrg.phone}</Descriptions.Item>
              <Descriptions.Item label={t.type} span={2}>{selectedOrg.types.join(', ')}</Descriptions.Item>
              <Descriptions.Item label={t.status}>
                <Tag color={selectedOrg.status === 'active' ? 'green' : selectedOrg.status === 'pending' ? 'orange' : 'red'}>
                  {selectedOrg.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t.created}>{new Date(selectedOrg.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label={t.maxBranches}>{selectedOrg.numberOfBranches}</Descriptions.Item>
              <Descriptions.Item label={t.maxUsers}>{selectedOrg.maxUsers}</Descriptions.Item>
              {selectedOrg.totalPrice && (
                <>
                  <Descriptions.Item label={t.totalPrice}>{selectedOrg.totalPrice} EGP</Descriptions.Item>
                  <Descriptions.Item label={t.billingCycle}>{selectedOrg.billingCycle}</Descriptions.Item>
                </>
              )}
              {selectedOrg.transactionReference && (
                <Descriptions.Item label={t.transactionRef} span={2}>{selectedOrg.transactionReference}</Descriptions.Item>
              )}
              {selectedOrg.paymentReceiptUrl && (
                <Descriptions.Item label={t.receipt} span={2}>
                  <a href={selectedOrg.paymentReceiptUrl} target="_blank" rel="noopener noreferrer">
                    <Button icon={<FileImageOutlined />}>View Receipt</Button>
                  </a>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>

        {/* Approve Confirmation Modal */}
        <Modal
          title={t.approveConfirm}
          open={approveModalVisible}
          onOk={confirmApprove}
          onCancel={() => setApproveModalVisible(false)}
          okText={t.confirm}
          cancelText={t.cancel}
          confirmLoading={isApproving}
        >
          <p>{t.approveMessage}</p>
          {selectedOrg && (
            <div style={{ marginTop: 16 }}>
              <p><strong>{t.name}:</strong> {language === 'en' ? selectedOrg.nameEn : selectedOrg.nameAr}</p>
              <p><strong>{t.email}:</strong> {selectedOrg.email}</p>
            </div>
          )}
        </Modal>

        {/* Reject Confirmation Modal */}
        <Modal
          title={t.rejectConfirm}
          open={rejectModalVisible}
          onOk={confirmReject}
          onCancel={() => setRejectModalVisible(false)}
          okText={t.confirm}
          cancelText={t.cancel}
          confirmLoading={isApproving}
        >
          <p>{t.rejectMessage}</p>
          <TextArea
            rows={4}
            placeholder={t.rejectionReasonPlaceholder}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            style={{ marginTop: 16 }}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}
