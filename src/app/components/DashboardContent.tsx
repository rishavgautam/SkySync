import { Button, Card, Col, Divider, Flex, Modal, Row, Slider, Spin, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import { SimplifiedWeatherCondition } from '../../utils/currentConditionMapping';
import { TextToImg } from '../../utils/textBasedSvgMapping';
import TemperatureConverter from './TempConverter'
import { SettingOutlined } from '@ant-design/icons';
import { GetCacheValue } from '@/utils/cacheServiceHelper';
import { GetLocalTime } from '@/utils/serviceHelper';

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
  const [isLoading, setLoading] = useState<boolean>(true);
  const [dailyData, setDailyData] = useState<any>({});
  const [aqiData, setAQIData] = useState<any>({});


  const fetchAQIData = async (location: string) => {
    try {
      const result = await apiClient(location, "GET", null, true);
      if (result.status === "ok") {
        setAQIData(result?.data)
      }
      else {
        setAQIData({})
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchData = async (param: string) => {
    try {
      const result = await apiClient(param, "GET");
      setResponse(result);
      setLocation(result.location);
      setCurrent(result.current);
      setForecast(result.forecast);

      const currDate = GetLocalTime(result?.location?.tz_id);
      const fullDayRecords = result.forecast.forecastday.slice(0, 2)
        .flatMap((day:any) => day.hour).filter((x:any) => x.time > currDate).slice(0, 24);
      setDailyData(fullDayRecords);

      if (result?.current?.air_quality?.pm2_5 === undefined) {
        fetchAQIData(result?.location?.name)
      }


      setLoading(false)
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const showModal = () => {
    setSettingsModalOpen(!settingsModalOpen);
  };

  useEffect(() => {
    const animationData = GetCacheValue('ShowAnimations')
    setIsAnimated(animationData === 'true' ? true : false)

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



  function calculateTotalSunHours() {
    const sunrise = moment(forecast?.forecastday[0]?.astro?.sunrise, 'hh:mm A');
    const sunset = moment(forecast?.forecastday[0]?.astro?.sunset, 'hh:mm A');
    const duration = moment.duration(sunset.diff(sunrise));
    const totalHours = duration.asHours();
    return Math.floor(totalHours)

  }

  function GetAQIData() {

    if(current?.air_quality?.pm2_5!==undefined)
    {
      return current?.air_quality?.pm2_5
    }
    else if(aqiData){
      return aqiData?.aqi
    }
    else{
      return'N/A'
    }

  }


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
            <TemperatureConverter temperatureValue={current?.temp_f} unit={unitType} />
          </p>

          <p className='current_condition'>{SimplifiedWeatherCondition(current?.condition?.text)}</p>


          {forecast?.forecastday ? (
            <>
              <p className="dailyNumbersMain">
                H:
                <TemperatureConverter temperatureValue={forecast.forecastday[0].day.maxtemp_f} unit={unitType} />
                &nbsp; L:
                <TemperatureConverter temperatureValue={forecast.forecastday[0].day.mintemp_f} unit={unitType} />
                
                
                &nbsp; | &nbsp;AQI :  {GetAQIData()}  
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
                  {dailyData.map((item: any) => {
                    const hour = moment(item.time, 'YYYY-MM-DD HH:mm').format('HH');
                    const imageSrc = TextToImg(item.condition.text, item?.is_day)
                    return (
                      <div key={item.time_epoch}>
                        <div className="card-content-hour">{hour}</div>
                        <div className="card-content-condition">
                          <img src={isAnimated ? '/animated/' + imageSrc : '/static/' + imageSrc}
                            alt={item.condition.text} width={50} height={45} title={item.condition.text} />
                        </div>
                        <div className="card-content-temp">
                          <TemperatureConverter temperatureValue={item.temp_f} unit={unitType} />
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

        <Row gutter={16} className='weatherBottomRow'>
          {forecast?.forecastday ? (
            <Col span={8}>
              <Card title="Weekly Forecast" className='weeklyForecastData' bordered={false}>

                {forecast.forecastday.map((item: any) => {
                  const dayName = moment(item.date).format('ddd');
                  const imageSrc = TextToImg(item.day.condition.text)
                  return (
                    <div className='row' key={item.date_epoch}>
                      <div className='col-md-2'>
                        <div className="card-content-item">{dayName}</div>
                      </div>
                      <div className='col-md-2'>
                        <div className='card-content-item'>
                          <img src={isAnimated ? '/animated/' + imageSrc : '/static/' + imageSrc}
                            alt={item.day.condition.text} width={40} height={35} />
                        </div>

                      </div>

                      <div className='col-md-2'>
                        <div className="card-content-item pushRight">
                          <TemperatureConverter temperatureValue={item.day.mintemp_f} unit={unitType} />
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
                          <TemperatureConverter temperatureValue={item.day.maxtemp_f} unit={unitType} />
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


          {/* Additional Data */}
          <Col span={8}>
            <Card title="At a glance" className='weeklyForecastData' bordered={false}>


              {forecast &&
                <>
                  <div className='row dailyInfo'>
                    <div className='col-md-8'>
                      <div className="card-content-item">Sunrise</div>
                    </div>

                    <div className='col-md-4'>
                      <div className="card-content-item">{forecast?.forecastday[0]?.astro?.sunrise}</div>

                    </div>

                    <hr className='custom-divider' />

                  </div>

                  <div className='row dailyInfo' >
                    <div className='col-md-8'>
                      <div className="card-content-item">Sunset</div>
                    </div>

                    <div className='col-md-4'>
                      <div className="card-content-item">{forecast?.forecastday[0]?.astro?.sunset}</div>


                    </div>

                    <hr className='custom-divider' />

                  </div>


                  <div className='row dailyInfo'>
                    <div className='col-md-8'>
                      <div className="card-content-item">Total Day Light</div>
                    </div>

                    <div className='col-md-4'>
                      {/* <div className="card-content-item">10hrs</div> */}
                      <div className="card-content-item">{calculateTotalSunHours()} hrs</div>
                    </div>

                    <hr className='custom-divider' />

                  </div>

                  <div className='row dailyInfo'>
                    <div className='col-md-8'>
                      <div className="card-content-item">Chances of Rain</div>
                    </div>

                    <div className='col-md-4'>
                      <div className="card-content-item">{forecast?.forecastday[0]?.day.daily_chance_of_rain} %</div>
                    </div>

                    <hr className='custom-divider' />

                  </div>
                </>
              }
            </Card>
          </Col>


          {/* //Small 4 blocks  */}
          <Col span={8}>
            <Row gutter={8}>
              <Col span={32} className='customSize'>
                <Card className='dashboardSmallBlocks' title="Feels Like" bordered={false}>
                  <div className='card-content-item bigFont'>
                    <TemperatureConverter temperatureValue={current?.feelslike_f} unit={unitType} />
                  </div>
                </Card>
              </Col>

              <Col span={32} className='customSize'>
                <Card className='dashboardSmallBlocks' title="Humidity" bordered={false}>
                  <div className='card-content-item bigFont'>
                    {current?.humidity} %
                  </div>
                </Card>
              </Col>

            </Row>
            <p style={{ marginBottom: '0.5rem' }}></p>
            <Row gutter={8}>
              <Col span={32} className='customSize'>
                <Card className='dashboardSmallBlocks bigFont' title="Wind" bordered={false}>
                  {unitType === 'C' ? current?.wind_kph + ' km ' : current?.wind_mph + ' mi '}
                </Card>
              </Col>

              <Col span={32} className='customSize'>
                <Card className='dashboardSmallBlocks bigFont' title="Visibility" bordered={false}>
                  {unitType === 'C' ? current?.vis_km + ' km ' : current?.vis_miles + ' mi '}

                </Card>
              </Col>

            </Row>
          </Col>

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