"use client";

import { Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import DashboardContent from './components/DashboardContent';
import { GetCacheValue } from '@/utils/cacheServiceHelper';
import Settings from './components/Settings';
const { Header, Content } = Layout;

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<any>({});
  const [weatherToken, setWeatherToken] = useState(false);


  const handleMenuClick = (item: any) => {
    setSelectedMenuItem(item);
  };


  useEffect(() => {
    const val = GetCacheValue('WeatherToken')
    if (val === null || val === '' || val === undefined) {
      setWeatherToken(false)
    }
    else {
      setWeatherToken(true)
    }

  }, [])




  return (
    <Layout className="layout">
      {weatherToken ?
        <>
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
              className="site-layout-background conditionChanger"
              style={{
                margin: '24px 16px',
                padding: 24,
              }}
            >
              <DashboardContent selectedMenuItem={selectedMenuItem} />
            </Content>
          </Layout>
        </>

        :
        <>
        <Settings openModal={true}/>
        </>
      }

    </Layout>
  )
}