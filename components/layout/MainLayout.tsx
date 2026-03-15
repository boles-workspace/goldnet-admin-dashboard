'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Button, Drawer } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TeamOutlined,
  CreditCardOutlined,
  DollarOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { startTour } from '@/store/slices/tourSlice';
import LanguageSwitcher from '../common/LanguageSwitcher';
import GuidedTour from '../common/GuidedTour';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { current: language, direction } = useAppSelector((state) => state.language);
  const { unreadCount } = useAppSelector((state) => state.notification);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const translations = {
    en: {
      dashboard: 'Dashboard',
      plans: 'Plans',
      organizations: 'Organizations',
      subscriptions: 'Subscriptions',
      payments: 'Payments',
      users: 'Users',
      analytics: 'Analytics',
      settings: 'Settings',
      help: 'Help',
      takeTour: 'Take a Tour',
      profile: 'Profile',
      logout: 'Logout',
      notifications: 'Notifications',
    },
    ar: {
      dashboard: 'لوحة التحكم',
      plans: 'الخطط',
      organizations: 'المؤسسات',
      subscriptions: 'الاشتراكات',
      payments: 'المدفوعات',
      users: 'المستخدمون',
      analytics: 'التحليلات',
      settings: 'الإعدادات',
      help: 'المساعدة',
      takeTour: 'جولة تعريفية',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      notifications: 'الإشعارات',
    },
  };

  const t = translations[language];

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t.dashboard,
      className: 'dashboard-menu',
      onClick: () => router.push('/dashboard'),
    },
    {
      key: '/plans',
      icon: <ShoppingOutlined />,
      label: t.plans,
      className: 'plans-menu',
      onClick: () => router.push('/plans'),
    },
    {
      key: '/organizations',
      icon: <TeamOutlined />,
      label: t.organizations,
      className: 'organizations-menu',
      onClick: () => router.push('/organizations'),
    },
    {
      key: '/subscriptions',
      icon: <CreditCardOutlined />,
      label: t.subscriptions,
      onClick: () => router.push('/subscriptions'),
    },
    {
      key: '/payments',
      icon: <DollarOutlined />,
      label: t.payments,
      className: 'payments-menu',
      onClick: () => router.push('/payments'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: t.users,
      onClick: () => router.push('/users'),
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: t.analytics,
      onClick: () => router.push('/analytics'),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t.profile,
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: t.settings,
      onClick: () => router.push('/settings'),
    },
    {
      key: 'takeTour',
      icon: <QuestionCircleOutlined />,
      label: t.takeTour,
      onClick: () => dispatch(startTour()),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t.logout,
      danger: true,
      onClick: () => {
        dispatch(logout());
        router.push('/login');
      },
    },
  ];

  const sidebarContent = (
    <>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed && !isMobile ? 18 : 20,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {collapsed && !isMobile ? 'GN' : 'GoldNet'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
        onClick={() => isMobile && setMobileDrawerOpen(false)}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth={80}
          className="sidebar-menu"
          width={250}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: direction === 'rtl' ? 'auto' : 0,
            right: direction === 'rtl' ? 0 : 'auto',
            top: 0,
            bottom: 0,
          }}
        >
          {sidebarContent}
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement={direction === 'rtl' ? 'right' : 'left'}
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          closable={false}
          width={250}
          styles={{
            body: { padding: 0, backgroundColor: '#001529' }
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Layout style={{
        marginLeft: !isMobile && direction === 'ltr' ? (collapsed ? 80 : 250) : 0,
        marginRight: !isMobile && direction === 'rtl' ? (collapsed ? 80 : 250) : 0,
        transition: 'all 0.2s'
      }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => {
              if (isMobile) {
                setMobileDrawerOpen(true);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            style={{ fontSize: 18 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="language-switcher">
              <LanguageSwitcher />
            </div>

            <Badge count={unreadCount} offset={[-5, 5]}>
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 20 }} />}
                onClick={() => router.push('/notifications')}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div
                className="user-menu"
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                {!isMobile && (
                  <span style={{ fontWeight: 500 }}>
                    {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                  </span>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: '#f0f2f5',
          }}
        >
          {children}
        </Content>
      </Layout>

      <GuidedTour />
    </Layout>
  );
}
