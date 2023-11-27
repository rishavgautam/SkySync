import { apiClient } from "@/utils/apiClient";
import { SimplifiedWeatherCondition } from "@/utils/currentConditionMapping";
import { Button, Input, Menu, Spin } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from 'react';
import TemperatureConverter from "./TempConverter";
import { GetCacheValue, SetCacheValue } from '../../utils/cacheServiceHelper';
import moment from "moment";
import 'moment-timezone';
import { GetLocalTime } from "@/utils/serviceHelper";
import { InfoCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';



interface SidebarProps {
    onMenuClick: (item: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick }) => {
    const moment = require('moment');
    const [selectedMenuItem, setSelectedMenuItem] = useState<number>(1);
    const [duplicateCheck, setDuplicateCheck] = useState<any[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)
    const [locationBasedData, setLocationBasedData] = useState<any[]>([]);
    const [localTime, setLocalTime] = useState<string>('');
    const [unitType, setUnitType] = useState<string>();


    const [searchValue, setSearchValue] = useState('');



    const handleMenuClick = (item: any) => {
        if (item != null) {
            setSelectedMenuItem(item.location.name);
            onMenuClick(item)
        }
    };

    useEffect(() => {
        if (locationBasedData.length > 0) {
            handleMenuClick(locationBasedData[0])
        }
    }, [locationBasedData])



    const fetchData = async (locationName: string) => {
        if (!duplicateCheck.includes(locationName)) {
            duplicateCheck.push(locationName)
            const param = `forecast.json?q=${locationName}&days=7&aqi=yes`
            try {
                const result = await apiClient(param, "GET");
                result["currentDateTime"] = GetLocalTime(result?.location?.tz_id)
                setLocationBasedData(prevData => [...prevData, result]);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    };

    useEffect(() => {
        var existingCache = GetCacheValue('UnitType')
        var existingLocation = GetCacheValue('Locations')
        if (existingCache === undefined) {
            SetCacheValue('UnitType', 'F')
        }
        else {
            setUnitType(existingCache?.toString())
        }

        const locations: string = existingLocation || ''
        if (locations !== '' && locations !== undefined) {
            const locationArray: string[] = locations.split(',');
            locationArray.map(item => fetchData(item));
            setLoading(false)
        }
        else {
            SetCacheValue('Locations', 'New York')
            fetchData("New York")
            setLoading(false)
        }



    }, [])


    const handleSearchInputChange = (e: any) => {
        setSearchValue(e.target.value);
    };

    const addLocation = () => {
        var existingLocation = GetCacheValue('Locations');
        const locations: string = existingLocation || ''
        if (locations !== '' && locations !== undefined) {
            const locationArray: string[] = locations.split(',');
            const newLocationArray: string[] = [...locationArray, searchValue]
            SetCacheValue("Locations", newLocationArray);
            window.location.reload()
        }
    };


    return (
        <Sider trigger={null} width={250} >
            <div className="logo" />
            <br />
            <div className="locationSearchBar">
                <Input
                    placeholder="Enter City"
                    value={searchValue}
                    onPressEnter={addLocation}
                    onChange={handleSearchInputChange}
                    suffix={
                          <SearchOutlined style={{ color: 'white' }} />
                      }

                />
            </div>
            <br />

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
                                            {moment(item.currentDateTime, 'YYYY-MM-DD HH:mm').format('hh:mm A')}

                                        </p>
                                    </h5>
                                </div>
                                <div className="col-md-4">
                                    <div className="tempVal">

                                        <TemperatureConverter temperatureValue={item.current.temp_f} unit={unitType} />

                                        {/* {Math.floor(item.current.temp_f)} <span className="tempDegree">&#176;</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className=" bottomSection row">
                                <div className="col-md-6 current_condition_sidebar">
                                    {SimplifiedWeatherCondition(item.current.condition.text)}
                                </div>

                                <div className="col-md-6">
                                    <div className="dailyNumbers">
                                        H:
                                        <TemperatureConverter temperatureValue={item.forecast.forecastday[0].day.maxtemp_f} unit={unitType} />

                                        {/* {Math.floor(item.forecast.forecastday[0].day.maxtemp_f)} <span className="tempDegree">&#176;</span> */}
                                        &nbsp; L:

                                        <TemperatureConverter temperatureValue={item.forecast.forecastday[0].day.mintemp_f} unit={unitType} />

                                        {/* {Math.floor(item.forecast.forecastday[0].day.maxtemp_f)} <span className="tempDegree">&#176;</span> */}
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