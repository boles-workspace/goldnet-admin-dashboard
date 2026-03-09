'use client';

import { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { current: language } = useAppSelector((state) => state.language);

  const translations = {
    en: {
      title: 'GoldNet Admin',
      subtitle: 'Sign in to your account',
      email: 'Email',
      password: 'Password',
      emailPlaceholder: 'Enter your email',
      passwordPlaceholder: 'Enter your password',
      emailRequired: 'Please input your email!',
      passwordRequired: 'Please input your password!',
      signIn: 'Sign In',
      forgotPassword: 'Forgot password?',
    },
    ar: {
      title: 'جولد نت - إدارة',
      subtitle: 'تسجيل الدخول إلى حسابك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      emailRequired: 'الرجاء إدخال البريد الإلكتروني!',
      passwordRequired: 'الرجاء إدخال كلمة المرور!',
      signIn: 'تسجيل الدخول',
      forgotPassword: 'نسيت كلمة المرور؟',
    },
  };

  const t = translations[language];

  const onFinish = async (values: any) => {
    setLoading(true);
    dispatch(loginStart());

    try {
      // API call would go here
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(loginSuccess(data.user));
        message.success(language === 'en' ? 'Login successful!' : 'تم تسجيل الدخول بنجاح!');
        router.push('/dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      dispatch(loginFailure('Invalid email or password'));
      message.error(language === 'en' ? 'Invalid email or password' : 'بريد إلكتروني أو كلمة مرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: 12,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <LanguageSwitcher />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0, color: '#1890ff' }}>
            {t.title}
          </h1>
          <p style={{ color: '#888', marginTop: 8 }}>{t.subtitle}</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label={t.email}
            rules={[
              { required: true, message: t.emailRequired },
              { type: 'email', message: language === 'en' ? 'Invalid email format' : 'تنسيق البريد الإلكتروني غير صحيح' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t.emailPlaceholder}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t.password}
            rules={[{ required: true, message: t.passwordRequired }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t.passwordPlaceholder}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ height: 45, fontSize: 16, fontWeight: 500 }}
            >
              {t.signIn}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <a href="/forgot-password">{t.forgotPassword}</a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
