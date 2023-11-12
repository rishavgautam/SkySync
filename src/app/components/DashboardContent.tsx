import { Card, Col, Row } from 'antd';
import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/apiClient';

interface DashboardContentProps {
  selectedMenuItem: any;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ selectedMenuItem }) => {
  const [response, setResponse] = useState('');
  const [url, setUrl] = useState(''); // Relative path

  const fetchData = async (param:string) => {

    try {
      const result = await apiClient(param, "GET");
      setResponse(result);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  useEffect(() => {
    if(selectedMenuItem.location!==undefined){
      const param = `forecast.json?q=${selectedMenuItem.location}&days=7&aqi=yes`
      setUrl(param)
      fetchData(param);
    }
    
  }, [selectedMenuItem]);



  return <div>
    <Row gutter={24}>
      <Col span={24}>
        <Card title="Card title" bordered={false}>
          Card content
        </Card>
      </Col>


    </Row>

    <br />
    <br />

    <Row gutter={16}>
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
    </Row>


  </div>;
};

export default DashboardContent;




