import { Card, Col, Row } from 'antd';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';
import moment from 'moment';

interface DashboardContentProps {
  selectedMenuItem: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ selectedMenuItem }) => {
  const moment = require('moment');

  const [response, setResponse] = useState('');
  const [url, setUrl] = useState(''); // Relative path


  const [location, setLocation] = useState<any>({});
  const [current, setCurrent] = useState<any>({});
  const [forecast, setForecast] = useState<any>({});

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
    if (selectedMenuItem.location !== undefined) {
      const param = `forecast.json?q=${selectedMenuItem.location.name}&days=7&aqi=yes`
      setUrl(param)
      fetchData(param);
    }

  }, [selectedMenuItem]);


  return <div className=''>

    <div className='col-md-12 currenData'>
      <p className='location_name'>{location?.name}</p>
      <p className='current_temp'>{Math.floor(current?.temp_f)} <span className="tempDegree">&#176;</span></p>
      <p className='current_condition'>{current?.condition?.text}</p>

      {forecast?.forecastday ? (
        <p className="dailyNumbersMain">
          H: {Math.floor(forecast.forecastday[0].day.maxtemp_f)} <span className="tempDegree">&#176;</span>
          &nbsp; L: {Math.floor(forecast.forecastday[0].day.mintemp_f)} <span className="tempDegree">&#176;</span>
        </p>
      ) : (
        <p className="fallbackMessage">No forecast data available</p>
      )}



    </div>

    {forecast?.forecastday ? (
      <Row gutter={24}>
        <Col span={24}>
          <Card title="Daily Forecast Information" bordered={false} className='dailyForecastDetails'>
            <div className='card-content-scrollable'>
              {forecast.forecastday[0].hour.map((item:any) => {
                const hour = moment(item.time, 'YYYY-MM-DD HH:mm').format('HH');
                return (
                  <div key={item.time_epoch}>
                    <div className="card-content-item">{hour}</div>
                    <div className="card-content-item">{item.condition.text}</div>
                    <div className="card-content-item">{Math.floor(item.temp_f)}</div>
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

    {/* <Row gutter={16}>
      <Col span={8}>
        <Card title="Card title" bordered={false}>
          Card content

        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>
    </Row> */}


  </div>;
};

export default DashboardContent;




