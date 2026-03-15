'use client';

import { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import {
  useGetAllPlansQuery,
  useDeletePlanMutation,
  useActivatePlanMutation,
  useDeactivatePlanMutation,
} from '@/store/api/planApi';
import CreatePlanModal from '@/components/plans/CreatePlanModal';
import EditPlanModal from '@/components/plans/EditPlanModal';
import MainLayout from '@/components/layout/MainLayout';
import { useAppSelector } from '@/store/hooks';
import type { ColumnsType } from 'antd/es/table';

interface TypePricing {
  jewelry_shop?: number;
  jewelry_workshop?: number;
  gold_trader?: number;
  gold_distributor?: number;
}

interface Plan {
  _id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  typePricing: TypePricing;
  currency: string;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'TWO_YEARS' | 'FIVE_YEARS';
  isActive: boolean;
}

export default function PlansPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { current: language } = useAppSelector((state) => state.language);
  const isArabic = language === 'ar';

  const { data: plans = [], isLoading, refetch } = useGetAllPlansQuery();
  const [deletePlan] = useDeletePlanMutation();
  const [activatePlan] = useActivatePlanMutation();
  const [deactivatePlan] = useDeactivatePlanMutation();

  const t = {
    title: isArabic ? 'إدارة الخطط' : 'Plans Management',
    createPlan: isArabic ? 'إنشاء خطة جديدة' : 'Create New Plan',
    name: isArabic ? 'الاسم' : 'Name',
    price: isArabic ? 'السعر' : 'Price',
    cycle: isArabic ? 'الفترة' : 'Billing Cycle',
    type: isArabic ? 'نوع المؤسسة' : 'Organization Type',
    status: isArabic ? 'الحالة' : 'Status',
    actions: isArabic ? 'الإجراءات' : 'Actions',
    active: isArabic ? 'نشط' : 'Active',
    inactive: isArabic ? 'غير نشط' : 'Inactive',
    edit: isArabic ? 'تعديل' : 'Edit',
    delete: isArabic ? 'حذف' : 'Delete',
    activate: isArabic ? 'تفعيل' : 'Activate',
    deactivate: isArabic ? 'إلغاء التفعيل' : 'Deactivate',
    monthly: isArabic ? 'شهري' : 'Monthly',
    quarterly: isArabic ? 'ربع سنوي' : 'Quarterly',
    yearly: isArabic ? 'سنوي' : 'Yearly',
    twoYears: isArabic ? 'سنتان' : 'Two Years',
    fiveYears: isArabic ? 'خمس سنوات' : 'Five Years',
    multiType: isArabic ? 'أسعار متعددة' : 'Multi-Type',
    shop: isArabic ? 'محل مجوهرات' : 'Jewelry Shop',
    workshop: isArabic ? 'ورشة' : 'Workshop',
    trader: isArabic ? 'تاجر ذهب' : 'Gold Trader',
    distributor: isArabic ? 'موزع' : 'Distributor',
    deleteConfirm: isArabic ? 'هل أنت متأكد من حذف هذه الخطة؟' : 'Are you sure you want to delete this plan?',
    deleteSuccess: isArabic ? 'تم حذف الخطة بنجاح' : 'Plan deleted successfully',
    deleteFailed: isArabic ? 'فشل حذف الخطة' : 'Failed to delete plan',
    statusSuccess: isArabic ? 'تم تحديث حالة الخطة بنجاح' : 'Plan status updated successfully',
    statusFailed: isArabic ? 'فشل تحديث حالة الخطة' : 'Failed to update plan status',
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePlan(id).unwrap();
      message.success(t.deleteSuccess);
      refetch();
    } catch (err) {
      message.error(t.deleteFailed);
      console.error('Failed to delete plan:', err);
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    try {
      if (plan.isActive) {
        await deactivatePlan(plan._id).unwrap();
      } else {
        await activatePlan(plan._id).unwrap();
      }
      message.success(t.statusSuccess);
      refetch();
    } catch (err) {
      message.error(t.statusFailed);
      console.error('Failed to toggle plan status:', err);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      JEWELRY_SHOP: t.shop,
      WORKSHOP: t.workshop,
      GOLD_TRADER: t.trader,
      DISTRIBUTOR: t.distributor,
    };
    return types[type] || type;
  };

  const getCycleLabel = (cycle: string) => {
    const cycles: Record<string, string> = {
      MONTHLY: t.monthly,
      QUARTERLY: t.quarterly,
      YEARLY: t.yearly,
      TWO_YEARS: t.twoYears,
      FIVE_YEARS: t.fiveYears,
    };
    return cycles[cycle] || cycle;
  };

  const columns: ColumnsType<Plan> = [
    {
      title: t.name,
      dataIndex: isArabic ? 'nameAr' : 'nameEn',
      key: 'name',
      render: (text: string, record: Plan) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {isArabic ? record.nameAr : record.nameEn}
          </div>
          {(isArabic ? record.descriptionAr : record.descriptionEn) && (
            <div style={{ fontSize: 12, color: '#666' }}>
              {isArabic ? record.descriptionAr : record.descriptionEn}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t.price,
      key: 'price',
      render: (_, record: Plan) => (
        <div>
          <div style={{ fontWeight: 600 }}>{t.multiType}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.currency}</div>
        </div>
      ),
    },
    {
      title: t.cycle,
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (cycle: string) => getCycleLabel(cycle),
    },
    {
      title: t.type,
      key: 'organizationType',
      render: (_, record: Plan) => {
        const types = Object.entries(record.typePricing || {})
          .filter(([_, price]) => price && price > 0)
          .map(([type]) => type);
        return (
          <div>
            {types.length > 0 ? (
              <div style={{ fontSize: 12 }}>
                {types.length} {isArabic ? 'أنواع' : 'types'}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#999' }}>-</div>
            )}
          </div>
        );
      },
    },
    {
      title: t.status,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? t.active : t.inactive}
        </Tag>
      ),
    },
    {
      title: t.actions,
      key: 'actions',
      render: (_, record: Plan) => (
        <Space size="small">
          <Button
            type="primary"
            ghost={record.isActive}
            danger={!record.isActive}
            icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
            size="small"
          >
            {record.isActive ? t.deactivate : t.activate}
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => setSelectedPlan(record._id)}
            size="small"
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirm}
            onConfirm={() => handleDelete(record._id)}
            okText={isArabic ? 'نعم' : 'Yes'}
            cancelText={isArabic ? 'لا' : 'No'}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              {t.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>{t.title}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
          size="large"
        >
          {t.createPlan}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={plans}
        loading={isLoading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => isArabic ? `المجموع ${total} خطة` : `Total ${total} plans`,
        }}
        style={{ background: '#fff', borderRadius: 8 }}
      />

      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refetch();
          setShowCreateModal(false);
        }}
        isArabic={isArabic}
      />

      <EditPlanModal
        planId={selectedPlan}
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSuccess={() => {
          refetch();
          setSelectedPlan(null);
        }}
        isArabic={isArabic}
      />
    </MainLayout>
  );
}
