import { Card, Col, Row } from 'antd';
import { useState , useEffect} from 'react';
import { apiClient } from '../../utils/apiClient';

interface DashboardContentProps {
  selectedMenuItem: number;
}


const DashboardContent: React.FC<DashboardContentProps> = ({ selectedMenuItem }) => {


  const [response, setResponse] = useState('');
  const [url, setUrl] = useState('v1/bpi/currentprice.json'); // Relative path

  const fetchData = async () => {
    try {
      const result = await apiClient(url, "GET"); 
      setResponse(result);
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error, display a message, or perform other actions as needed
    }
  };


  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []); 


    // Use the key to dynamically change content
    let content = '';  
    switch (selectedMenuItem) {
      case 1:
        content = 'Dashboard Content';
        break;
      case 2:
        content = 'Profile Content';
        break;
      case 3:
        content = 'Settings Content';
        break;
      default:
        content = 'Unknown Content';
    }
  
    return <div>
      
      
      {content}
      
<Row gutter={24}>
    <Col span={24}>
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </Col>
    
    
  </Row>

  <br/>  
  <br/> 

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



  
