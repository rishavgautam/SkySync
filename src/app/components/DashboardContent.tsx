import { Button, Card, Col, Divider, Flex, Modal, Row, Slider, Spin, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { SimplifiedWeatherCondition } from '../../utils/currentConditionMapping';
import { TextToImg } from '../../utils/textBasedSvgMapping';
import TemperatureConverter from './TempConverter'
import { SettingOutlined } from '@ant-design/icons';
import { GetCacheValue } from '@/utils/cacheServiceHelper';
import Settings from './Settings';


interface DashboardContentProps {
  selectedMenuItem: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ selectedMenuItem }) => {
  const moment = require('moment');
  const [response, setResponse] = useState('');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState<any>({});
  const [current, setCurrent] = useState<any>({});
  const [forecast, setForecast] = useState<any>({});
  const [isAnimated, setIsAnimated] = useState<boolean>(false);
  const [unitType, setUnitType] = useState<string>('C');
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true)



  const fetchData = async (param: string) => {
    try {
      const result = await apiClient(param, "GET");
      setResponse(result);
      setLocation(result.location);
      setCurrent(result.current);
      setForecast(result.forecast);
      setLoading(false)
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const showModal = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };

  useEffect(() => {
    var unitTypeVal = GetCacheValue('UnitType');
    if (unitTypeVal != undefined && unitTypeVal != null && unitTypeVal != '') {
      setUnitType(unitTypeVal)
    }

    if (selectedMenuItem.location !== undefined) {
      const param = `forecast.json?q=${selectedMenuItem.location.name}&days=7&aqi=yes`
      setUrl(param)
      fetchData(param);
    }

  }, [selectedMenuItem]);



  return <div className='dashoardMainBody'>
    {!isLoading ? (
      <>
        <Tooltip title="">
          <Flex justify={"flex-end"} align={"flex-start"}>
            <Button shape="circle" onClick={showModal} icon={<SettingOutlined />}></Button>
          </Flex>
        </Tooltip>


        <div className='col-md-12 currenData'>
          <p className='location_name'>{location?.name}</p>
          <p className='current_temp'>
            <TemperatureConverter temperatureValue={current?.temp_f} unit={unitType} requireDegree={true} />
          </p>

          <p className='current_condition'>{SimplifiedWeatherCondition(current?.condition?.text)}</p>


          {forecast?.forecastday ? (
            <>
              <p className="dailyNumbersMain">
                H:
                <TemperatureConverter temperatureValue={forecast.forecastday[0].day.maxtemp_f} unit={unitType} requireDegree={true} />
                &nbsp; L:
                <TemperatureConverter temperatureValue={forecast.forecastday[0].day.mintemp_f} unit={unitType} requireDegree={true} />
                &nbsp; | &nbsp;AQI : {Math.floor(forecast.forecastday[0].day.air_quality.pm2_5)}
              </p>
              <p className="dailyNumbersMain">

              </p>
            </>

          ) : (
            <p className="fallbackMessage">No forecast data available</p>
          )}

        </div>

        {forecast?.forecastday ? (
          <Row gutter={24}>
            <Col span={24}>
              <Card title="Daily Forecast Information" bordered={false} className='dailyForecastDetails'>
                <div className='card-content-scrollable'>
                  {forecast.forecastday[0].hour.map((item: any) => {
                    const hour = moment(item.time, 'YYYY-MM-DD HH:mm').format('HH');
                    return (
                      <div key={item.time_epoch}>
                        <div className="card-content-hour">{hour}</div>
                        <div className="card-content-condition">
                          <img src={isAnimated ? '/animated/' : '/static/' + TextToImg(item.condition.text)}
                            alt={item.condition.text} width={50} height={45} />
                        </div>

                        <div className="card-content-temp">
                          <TemperatureConverter temperatureValue={item.temp_f} unit={unitType} requireDegree={false} />

                        </div>
                      </div>
                    );
                  })}

                </div>

              </Card>
            </Col>


          </Row>

        ) : (
          <p className="fallbackMessage">No forecast data available</p>
        )}

        <br />
        <br />

        <Row gutter={16}>
          {forecast?.forecastday ? (
            <Col span={8}>
              <Card title="Weekly Forecast" className='weeklyForecastData' bordered={false}>

                {forecast.forecastday.map((item: any) => {
                  const dayName = moment(item.date).format('ddd');
                  return (
                    <div className='row' key={item.date_epoch}>
                      <div className='col-md-2'>
                        <div className="card-content-item">{dayName}</div>
                      </div>
                      <div className='col-md-2'>
                        <div className='card-content-item'>
                          <img src={isAnimated ? '/animated/' : '/static/' + TextToImg(item.day.condition.text)}
                            alt={item.day.condition.text} width={40} height={35} />
                        </div>

                      </div>

                      <div className='col-md-2'>
                        <div className="card-content-item pushRight">
                          <TemperatureConverter temperatureValue={item.day.mintemp_f} unit={unitType} requireDegree={false} />
                        </div>

                      </div>

                      <div className='col-md-4'>
                        <div className='card-content-item'>
                          <Slider range defaultValue={
                            unitType === 'C' ?
                              [item.day.mintemp_c, item.day.maxtemp_c]
                              :
                              [item.day.mintemp_f, item.day.maxtemp_f]
                          }
                            min={unitType === 'C' ? (item.day.mintemp_c - 3) : (item.day.mintemp_f - 10)}
                            max={unitType === 'C' ? (item.day.maxtemp_c + 4) : (item.day.maxtemp_f + 20)}

                            style={{ pointerEvents: 'none' }}
                          />

                        </div>

                      </div>
                      <div className='col-md-2'>
                        <div className='card-content-item'>
                        <TemperatureConverter temperatureValue={item.day.maxtemp_f} unit={unitType} requireDegree={false} />
                        </div>
                      </div>
                      <hr className='custom-divider' />

                    </div>
                  )
                })}

              </Card>
            </Col>
          ) : (
            <p className="fallbackMessage">No forecast data available</p>
          )}

          {/* <Col span={8}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col> */}
        </Row>

        {settingsModalOpen &&
          <Settings openModal={settingsModalOpen} />

        }


      </>
    ) :
      <div className="spinner-body">
        <Spin />
      </div>

    }


  </div>
};

export default DashboardContent;