import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from 'react';

interface SidebarProps {
    onMenuClick: (item: any) => void;
  }

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
    const [selectedMenuItem, setSelectedMenuItem] = useState<number>(1);
    const handleMenuClick = (item: any) => {
        if(item!=null){
            setSelectedMenuItem(item.key);
            onMenuClick(item)
        }
    };

    useEffect(() => {
      handleMenuClick(items[0])
    }, [])
    

    const items: any[] = [
        { key: 1, location: 'Greensboro', temperature: 16, condition: 'Cloudy', high: 6, low: 2 },
        { key: 2, location: 'Bangkok', temperature: 32, condition: 'Storm', high: 40, low: 23 },
        { key: 3, location: 'Kathmandu', temperature: 18, condition: 'Sunny', high: 26, low: 12 },
    ];

    return (
        <Sider trigger={null} width={250}>
            <div className="logo" />
            <Menu mode="inline" theme="dark" defaultSelectedKeys={[items[0].key.toString()]}
                selectedKeys={[selectedMenuItem.toString()]}>
                
                {items.map((item) => (
                    <Menu.Item key={item.key} icon={item.icon} 
                    onClick={() => handleMenuClick(item)}>

                        <div className="topSection row ">
                            <div className="col-md-8">
                                <h5>
                                    {item.location}
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
