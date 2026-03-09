'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { store, persistor } from '@/store';
import { useAppSelector } from '@/store/hooks';
import enUS from 'antd/locale/en_US';
import arEG from 'antd/locale/ar_EG';
import { useEffect } from 'react';
import './globals.css';

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { current: language, direction } = useAppSelector((state) => state.language);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return (
    <ConfigProvider
      locale={language === 'ar' ? arEG : enUS}
      direction={direction}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <title>GoldNet Admin Dashboard</title>
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AntdConfigProvider>
              {children}
            </AntdConfigProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
