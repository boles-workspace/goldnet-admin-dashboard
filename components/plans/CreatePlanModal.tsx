'use client';

import React, { useState } from 'react';
import { useCreatePlanMutation, CreatePlanData } from '@/store/api/planApi';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isArabic: boolean;
}

const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isArabic,
}) => {
  const [createPlan, { isLoading }] = useCreatePlanMutation();

  const [formData, setFormData] = useState<CreatePlanData>({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    typePricing: {
      jewelry_shop: 300,
      jewelry_workshop: 500,
      gold_trader: 700,
      gold_distributor: 1000,
    },
    bundleDiscounts: {
      '1': 0,
      '2': 0.15,
      '3': 0.25,
      '4': 0.35,
    },
    currency: 'EGP',
    billingCycle: 'MONTHLY',
    features: [],
    maxUsers: undefined,
    maxBranches: undefined,
    maxStorage: undefined,
    isActive: true,
    isPopular: false,
    order: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTypePricingChange = (type: keyof typeof formData.typePricing, value: string) => {
    setFormData((prev) => ({
      ...prev,
      typePricing: {
        ...prev.typePricing,
        [type]: Number(value) || 0,
      },
    }));
  };

  const handleBundleDiscountChange = (bundle: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      bundleDiscounts: {
        ...prev.bundleDiscounts,
        [bundle]: Number(value) || 0,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = isArabic ? 'الاسم بالإنجليزية مطلوب' : 'English name is required';
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = isArabic ? 'الاسم بالعربية مطلوب' : 'Arabic name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createPlan(formData).unwrap();
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Failed to create plan:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      typePricing: {
        jewelry_shop: 300,
        jewelry_workshop: 500,
        gold_trader: 700,
        gold_distributor: 1000,
      },
      bundleDiscounts: {
        '1': 0,
        '2': 0.15,
        '3': 0.25,
        '4': 0.35,
      },
      currency: 'EGP',
      billingCycle: 'MONTHLY',
      features: [],
      maxUsers: undefined,
      maxBranches: undefined,
      maxStorage: undefined,
      isActive: true,
      isPopular: false,
      order: 0,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-2xl font-bold">
            {isArabic ? 'إنشاء خطة جديدة' : 'Create New Plan'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الاسم بالإنجليزية' : 'Name (English)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.nameEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={isArabic ? 'أدخل الاسم بالإنجليزية' : 'Enter English name'}
              />
              {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.nameAr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={isArabic ? 'أدخل الاسم بالعربية' : 'Enter Arabic name'}
              />
              {errors.nameAr && <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>}
            </div>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الوصف بالإنجليزية' : 'Description (English)'}
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder={isArabic ? 'أدخل الوصف بالإنجليزية' : 'Enter English description'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الوصف بالعربية' : 'Description (Arabic)'}
              </label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder={isArabic ? 'أدخل الوصف بالعربية' : 'Enter Arabic description'}
              />
            </div>
          </div>

          {/* Type Pricing Section */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              {isArabic ? 'التسعير حسب النوع' : 'Type Pricing'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'محل مجوهرات' : 'Jewelry Shop'}
                </label>
                <input
                  type="number"
                  value={formData.typePricing.jewelry_shop}
                  onChange={(e) => handleTypePricingChange('jewelry_shop', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'ورشة مجوهرات' : 'Jewelry Workshop'}
                </label>
                <input
                  type="number"
                  value={formData.typePricing.jewelry_workshop}
                  onChange={(e) => handleTypePricingChange('jewelry_workshop', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'تاجر ذهب' : 'Gold Trader'}
                </label>
                <input
                  type="number"
                  value={formData.typePricing.gold_trader}
                  onChange={(e) => handleTypePricingChange('gold_trader', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'موزع ذهب' : 'Gold Distributor'}
                </label>
                <input
                  type="number"
                  value={formData.typePricing.gold_distributor}
                  onChange={(e) => handleTypePricingChange('gold_distributor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Bundle Discounts Section */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              {isArabic ? 'خصومات الباقات' : 'Bundle Discounts'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'نوع واحد' : '1 Type'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bundleDiscounts['1']}
                    onChange={(e) => handleBundleDiscountChange('1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    ({(formData.bundleDiscounts['1'] * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'نوعان' : '2 Types'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bundleDiscounts['2']}
                    onChange={(e) => handleBundleDiscountChange('2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    ({(formData.bundleDiscounts['2'] * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? '3 أنواع' : '3 Types'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bundleDiscounts['3']}
                    onChange={(e) => handleBundleDiscountChange('3', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    ({(formData.bundleDiscounts['3'] * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? '4 أنواع' : '4 Types'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.bundleDiscounts['4']}
                    onChange={(e) => handleBundleDiscountChange('4', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-2 text-gray-500">
                    ({(formData.bundleDiscounts['4'] * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Currency and Billing Cycle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'العملة' : 'Currency'}
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="EGP">EGP - {isArabic ? 'جنيه مصري' : 'Egyptian Pound'}</option>
                <option value="USD">USD - {isArabic ? 'دولار أمريكي' : 'US Dollar'}</option>
                <option value="SAR">SAR - {isArabic ? 'ريال سعودي' : 'Saudi Riyal'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'دورة الفوترة' : 'Billing Cycle'}
              </label>
              <select
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="MONTHLY">{isArabic ? 'شهري' : 'Monthly'}</option>
                <option value="QUARTERLY">{isArabic ? 'ربع سنوي' : 'Quarterly'}</option>
                <option value="YEARLY">{isArabic ? 'سنوي' : 'Yearly'}</option>
                <option value="TWO_YEARS">{isArabic ? 'سنتان' : 'Two Years'}</option>
                <option value="FIVE_YEARS">{isArabic ? 'خمس سنوات' : 'Five Years'}</option>
              </select>
            </div>
          </div>

          {/* Limits Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {isArabic ? 'الحدود' : 'Limits'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الحد الأقصى للمستخدمين' : 'Max Users'}
                </label>
                <input
                  type="number"
                  name="maxUsers"
                  value={formData.maxUsers || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={isArabic ? 'غير محدود' : 'Unlimited'}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الحد الأقصى للفروع' : 'Max Branches'}
                </label>
                <input
                  type="number"
                  name="maxBranches"
                  value={formData.maxBranches || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={isArabic ? 'غير محدود' : 'Unlimited'}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isArabic ? 'الحد الأقصى للتخزين (GB)' : 'Max Storage (GB)'}
                </label>
                <input
                  type="number"
                  name="maxStorage"
                  value={formData.maxStorage || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder={isArabic ? 'غير محدود' : 'Unlimited'}
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes and Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  {isArabic ? 'نشط' : 'Active'}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPopular"
                  id="isPopular"
                  checked={formData.isPopular}
                  onChange={handleChange}
                  className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="isPopular" className="ml-2 text-sm font-medium text-gray-700">
                  {isArabic ? 'شائع' : 'Popular'}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading
                ? isArabic
                  ? 'جاري الإنشاء...'
                  : 'Creating...'
                : isArabic
                ? 'إنشاء'
                : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlanModal;
