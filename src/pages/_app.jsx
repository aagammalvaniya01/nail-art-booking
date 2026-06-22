import React from 'react';
import { AppProvider } from '../context/AppContext';
import MainLayout from '../layouts/MainLayout';
import '../index.css';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AppProvider>
  );
}
