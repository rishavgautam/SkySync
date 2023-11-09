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
  
    return <div>{content}</div>;
  };

  export default DashboardContent;
