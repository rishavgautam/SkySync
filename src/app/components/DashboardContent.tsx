import { Card, Col, Row } from 'antd';


interface DashboardContentProps {
  selectedMenuItem: number;
}


const DashboardContent: React.FC<DashboardContentProps> = ({ selectedMenuItem }) => {
    // Use the key to dynamically change content
    let content = '';
    console.log(selectedMenuItem)
  
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



  
