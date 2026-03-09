'use client';

import { useEffect } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTourActive, completeTour, setCurrentStep } from '@/store/slices/tourSlice';
import { updatePreferences } from '@/store/slices/userSlice';

export default function GuidedTour() {
  const dispatch = useAppDispatch();
  const { isActive, currentStep } = useAppSelector((state) => state.tour);
  const { current: language } = useAppSelector((state) => state.language);
  const { preferences } = useAppSelector((state) => state.user);

  // Check if tour should start automatically
  useEffect(() => {
    if (preferences && !preferences.tourCompleted && !isActive) {
      // Auto-start tour on first login after a short delay
      setTimeout(() => {
        dispatch(setTourActive(true));
      }, 1000);
    }
  }, [preferences, isActive, dispatch]);

  const steps: Step[] = [
    {
      target: 'body',
      content: language === 'ar'
        ? 'مرحباً بك في لوحة تحكم جولد نت! دعنا نأخذك في جولة سريعة.'
        : 'Welcome to GoldNet Admin Dashboard! Let us give you a quick tour.',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.sidebar-menu',
      content: language === 'ar'
        ? 'استخدم هذه القائمة للتنقل بين الأقسام المختلفة.'
        : 'Use this menu to navigate between different sections.',
      placement: 'right',
    },
    {
      target: '.dashboard-menu',
      content: language === 'ar'
        ? 'لوحة التحكم الرئيسية - عرض المقاييس والإحصائيات الرئيسية.'
        : 'Main Dashboard - View key metrics and statistics.',
      placement: 'right',
    },
    {
      target: '.organizations-menu',
      content: language === 'ar'
        ? 'إدارة المؤسسات - الموافقة على الطلبات وإدارة المؤسسات.'
        : 'Organizations - Approve requests and manage organizations.',
      placement: 'right',
    },
    {
      target: '.payments-menu',
      content: language === 'ar'
        ? 'المدفوعات - مراجعة والموافقة أو رفض المدفوعات.'
        : 'Payments - Review and approve or reject payments.',
      placement: 'right',
    },
    {
      target: '.language-switcher',
      content: language === 'ar'
        ? 'تبديل اللغة بين الإنجليزية والعربية.'
        : 'Switch language between English and Arabic.',
      placement: 'bottom',
    },
    {
      target: '.user-menu',
      content: language === 'ar'
        ? 'الوصول إلى الملف الشخصي والإعدادات وإعادة الجولة.'
        : 'Access your profile, settings, and restart this tour.',
      placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, index, type } = data;

    if (type === 'step:after') {
      dispatch(setCurrentStep(index + 1));
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      dispatch(setTourActive(false));

      if (status === STATUS.FINISHED) {
        dispatch(completeTour());

        const preferences = {
          tourCompleted: true,
          tourCompletedAt: new Date().toISOString(),
          tourVersion: '1.0',
        };

        dispatch(updatePreferences(preferences));

        // Save to backend
        try {
          await fetch('http://localhost:3000/users/preferences', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(preferences),
          });
        } catch (error) {
          console.error('Failed to save tour completion:', error);
        }
      }
    }
  };

  if (!isActive) return null;

  return (
    <Joyride
      steps={steps}
      run={isActive}
      continuous
      showProgress
      showSkipButton
      stepIndex={currentStep}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#1890ff',
          zIndex: 10000,
          borderRadius: 6,
        },
        tooltipContainer: {
          textAlign: language === 'ar' ? 'right' : 'left',
        },
        buttonNext: {
          backgroundColor: '#1890ff',
          borderRadius: 4,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#1890ff',
          marginRight: language === 'ar' ? 0 : 8,
          marginLeft: language === 'ar' ? 8 : 0,
        },
      }}
      locale={{
        back: language === 'ar' ? 'السابق' : 'Previous',
        close: language === 'ar' ? 'إغلاق' : 'Close',
        last: language === 'ar' ? 'إنهاء' : 'Finish',
        next: language === 'ar' ? 'التالي' : 'Next',
        skip: language === 'ar' ? 'تخطي' : 'Skip',
      }}
    />
  );
}
