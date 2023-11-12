import { apiClient } from "@/utils/apiClient";
import { Menu, Spin } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from 'react';

interface SidebarProps {
    onMenuClick: (item: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
    const moment = require('moment');
    const [selectedMenuItem, setSelectedMenuItem] = useState<number>(1);
    const [duplicateCheck, setDuplicateCheck] = useState<any[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)
    const [locationBasedData, setLocationBasedData] = useState<any[]>([]);

    const handleMenuClick = (item: any) => {
        if (item != null) {
            setSelectedMenuItem(item.location.name);
            onMenuClick(item)
        }
    };

    useEffect(() => {
        if(locationBasedData.length>0){
            handleMenuClick(locationBasedData[0])
        }
    }, [locationBasedData])



    const fetchData = async (locationName: string) => {
        if (!duplicateCheck.includes(locationName)) {
            duplicateCheck.push(locationName)
            const param = `forecast.json?q=${locationName}&days=7&aqi=yes`
            try {
                const result = await apiClient(param, "GET");
                setLocationBasedData(prevData => [...prevData, result]);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    };

    useEffect(() => {
        const locations: any[] = ['Greensboro', 'Bangkok', 'Kathmandu', 'Olympia']
        locations.forEach(item => {
            fetchData(item)
        });
        setLoading(false)
    }, [])

    
    return (
        <Sider trigger={null} width={250}>
            <div className="logo" />
            {!isLoading && locationBasedData.length > 0 ? (
                <Menu mode="inline" theme="dark" 
                defaultSelectedKeys={[locationBasedData[0].location.name.toString()]}
                    selectedKeys={[selectedMenuItem.toString()]}
                    >
                    {locationBasedData.map((item) => (
                        <Menu.Item key={item.location.name} icon={item.icon}
                            onClick={() => handleMenuClick(item)}>
                            <div className="topSection row ">
                                <div className="col-md-8">
                                    <h5>
                                        {item.location.name}
                                        <p className="sidebarLocalTime">
                                        {moment(item.location.localtime, 'YYYY-MM-DD HH:mm').format('hh:mm A')}

                                        </p>
                                    </h5>
                                </div>
                                <div className="col-md-4">
                                    <div className="tempVal">
                                        {Math.floor(item.current.temp_f)} <span className="tempDegree">&#176;</span>
                                    </div>
                                </div>
                            </div>
                            <div className=" bottomSection row">
                                <div className="col-md-6 ">
                                    {item.current.condition.text}
                                </div>

                                <div className="col-md-6">
                                    <div className="dailyNumbers">
                                        H: {Math.floor(item.forecast.forecastday[0].day.maxtemp_f)} <span className="tempDegree">&#176;</span>
                                        &nbsp; L: {Math.floor(item.forecast.forecastday[0].day.maxtemp_f)} <span className="tempDegree">&#176;</span>
                                    </div>
                                </div>


                            </div>
                        </Menu.Item>
                    ))}
                </Menu>
            )
                :
                <div className="spinner">
                    <Spin />
                </div>
            }

        </Sider>

    )
}

export default Sidebar;
