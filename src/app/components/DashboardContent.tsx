import { Button, Card, Col, Flex, Modal, Row, Slider, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { SimplifiedWeatherCondition } from '../../utils/currentConditionMapping';
import { TextToImg } from '../../utils/textBasedSvgMapping';
import TemperatureConverter from './TempConverter'
import { SettingOutlined } from '@ant-design/icons';
import { GetCacheValue } from '@/utils/cacheServiceHelper';

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
  const [open, setOpen] = useState<boolean>(false);
  const [unitType, setUnitType] = useState<string>('C');

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const fetchData = async (param: string) => {
    try {
      const result = await apiClient(param, "GET");
      setResponse(result);
      setLocation(result.location);
      setCurrent(result.current);
      setForecast(result.forecast);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  useEffect(() => {
    var unitTypeVal = GetCacheValue('UnitType');
    if(unitTypeVal!=undefined && unitTypeVal!=null && unitTypeVal!=''){
      setUnitType(unitTypeVal)
    } 

    if (selectedMenuItem.location !== undefined) {
      const param = `forecast.json?q=${selectedMenuItem.location.name}&days=7&aqi=yes`
      setUrl(param)
      fetchData(param);
    }

  }, [selectedMenuItem]);



  return <div className='dashoardMainBody'>
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
                  <div className='col-md-1'>

                    <img src={isAnimated ? '/animated/' : '/static/' + TextToImg(item.day.condition.text)}
                      alt={item.day.condition.text} width={50} height={45} />


                  </div>

                  <div className='col-md-3 pushRight'>
                    <div className="">
                      <TemperatureConverter temperatureValue={item.day.mintemp_f} unit={unitType} requireDegree={false} />
                    </div>

                  </div>

                  <div className='col-md-4'>

                    <Slider range defaultValue={[item.day.mintemp_f, item.day.maxtemp_f]} />

                  </div>
                  <div className='col-md-2'>
                    <TemperatureConverter temperatureValue={item.day.maxtemp_f} unit={unitType} requireDegree={false} />
                  </div>

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



    <Modal
      open={open}
      title="Settings"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <Button>Custom Button</Button>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>

  </div>
};

export default DashboardContent;




