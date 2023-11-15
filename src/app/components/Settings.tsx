import { SetCacheValue, GetCacheValue } from '@/utils/cacheServiceHelper';
import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'


interface SettingsContentProps {
  openModal: boolean;

}



const Settings: React.FC<SettingsContentProps> = ({ openModal }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isCelsius, setIsCelsius] = useState(true); // Set default to Celsius

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };


  useEffect(() => {
    const val = GetCacheValue('UnitType')
    setIsCelsius(val === 'C' ? true : false)
    setOpen(openModal)
  }, [openModal])






  const handleCelsiusClick = () => {
    if (!isCelsius) {
      setIsCelsius(true);
      SetCacheValue('UnitType', 'C');
      window.location.reload();
    }
  };

  const handleFahrenheitClick = () => {
    if (isCelsius) {
      setIsCelsius(false);
      SetCacheValue('UnitType', 'F');
      window.location.reload();
    }
  };

  return (
    <Modal open={open} title="Weather Settings" onOk={handleOk} onCancel={handleCancel} >


      <p className='temperatureSetting'>Temperature Unit</p>
      <div>
        <Button type={isCelsius ? 'primary' : 'default'} onClick={handleCelsiusClick}>
          Celsius (<span className="tempDegree_settings">&#176;</span> C)
        </Button>
        &nbsp;&nbsp;

        <Button type={!isCelsius ? 'primary' : 'default'} onClick={handleFahrenheitClick}>
          Fahrenheit (<span className="tempDegree_settings">&#176;</span> F)
        </Button>
      </div>
    </Modal>
  )
}

export default Settings