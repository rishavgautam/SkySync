"use client";

import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import DashboardContent from './components/DashboardContent';
const { Header, Content } = Layout;

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>({});

  const handleMenuClick = (item: any) => {
    setSelectedMenuItem(item);
  };
  
  
  return (
    <Layout className="layout">
      <Sidebar onMenuClick={handleMenuClick} />
      <Layout className="site-layout mainBodyComponent">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >

        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          <DashboardContent selectedMenuItem={selectedMenuItem} />
        </Content>
      </Layout>
    </Layout>
  )
}