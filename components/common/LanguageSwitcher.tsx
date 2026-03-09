'use client';

import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleLanguage } from '@/store/slices/languageSlice';

export default function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const { current } = useAppSelector((state) => state.language);

  const handleToggle = async () => {
    dispatch(toggleLanguage());

    // Optionally save to backend
    try {
      await fetch('http://localhost:3000/users/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          language: current === 'en' ? 'ar' : 'en'
        }),
      });
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <Button
      type="text"
      icon={<GlobalOutlined />}
      onClick={handleToggle}
      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
    >
      {current === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}
