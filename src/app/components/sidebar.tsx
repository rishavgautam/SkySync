import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from 'react';


interface SidebarProps {
    onMenuClick: (key: number) => void;
  }

// export default function Sidebar() {
const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {

    const [selectedMenuItem, setSelectedMenuItem] = useState<number>(1);


    const handleMenuClick = (key: number) => {
        setSelectedMenuItem(key);
        onMenuClick(key)
    };


    const items: any[] = [
        { key: 1, label: 'My Location', temperature: 16, condition: 'Cloudy', high: 6, low: 2 },
        { key: 2, label: 'Bangkok', temperature: 32, condition: 'Storm', high: 40, low: 23 },
        { key: 3, label: 'Kathmandu', temperature: 18, condition: 'Sunny', high: 26, low: 12 },
    ];
    return (
        <Sider trigger={null} width={250}>
            <div className="logo" />

            <Menu mode="inline" theme="dark" defaultSelectedKeys={['1']}
                selectedKeys={[selectedMenuItem.toString()]}
            >
                {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon} 
                    onClick={() => handleMenuClick(item.key)}>

                        <div className="topSection row ">
                            <div className="col-md-8">
                                <h5>
                                    {item.label}
                                </h5>
                            </div>
                            <div className="col-md-4">
                                <div className="tempVal">
                                    {item.temperature} <span className="tempDegree">&#176;</span>
                                </div>
                            </div>
                        </div>
                        <div className=" bottomSection row">
                            <div className="col-md-6">
                                {item.condition}
                            </div>

                            <div className="col-md-6">
                                <div className="dailyNumbers">
                                    H: {item.high} <span className="tempDegree">&#176;</span>
                                     &nbsp; L: {item.low} <span className="tempDegree">&#176;</span>
                                </div>
                            </div>


                        </div>
                    </Menu.Item>
                ))}
            </Menu>
        </Sider>

    )
}

export default Sidebar;
