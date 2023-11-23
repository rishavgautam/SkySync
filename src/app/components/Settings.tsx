import { SetCacheValue, GetCacheValue } from '@/utils/cacheServiceHelper';
import { Button, Input, Modal, Switch } from 'antd'
import React, { useEffect, useState } from 'react'


interface SettingsContentProps {
  openModal: boolean;

}



const Settings: React.FC<SettingsContentProps> = ({ openModal }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isCelsius, setIsCelsius] = useState(true); // Set default to Celsius
  const [showDegreeUnit, setShowDegreeUnit] = useState(true); // Set default to Celsius
  const [showAnimations, setShowAnimations] = useState(false); // Set default to Celsius
  const [weatherToken, setWeatherToken] = useState<string>('');
  const [AQIToken, setAQIToken] = useState<string>('');

  // const handleOk = () => {
  //   setOpen(false);
  // };

  const handleCancel = () => {
    setOpen(false);
  };


  useEffect(() => {
    const val = GetCacheValue('UnitType')
    const showDegree = GetCacheValue('ShowDegree')
    const showAnimation = GetCacheValue('ShowAnimations')
    const weatherKey = GetCacheValue('WeatherToken')
    const aqiKey = GetCacheValue('AQIToken')

    setIsCelsius(val === 'C' ? true : false)
    setShowDegreeUnit(showDegree === 'true' ? true : false)
    setShowAnimations(showAnimation === 'true' ? true : false)
    setWeatherToken(weatherKey ?? '')
    setAQIToken(aqiKey ?? '')

    setOpen(openModal)
  }, [openModal])



  const handleOk = () => {
    SetCacheValue('UnitType', isCelsius ? 'C' : 'F');
    SetCacheValue('ShowAnimations', showAnimations.toString());
    SetCacheValue('ShowDegree', showDegreeUnit.toString());
    SetCacheValue('WeatherToken', weatherToken);
    SetCacheValue('AQIToken', AQIToken);
    window.location.reload();

    setOpen(false);
  };


  return (
    <Modal maskClosable={false} open={open} title="Weather Settings" onOk={handleOk} onCancel={handleCancel}>
      <p className='temperatureSetting'>Temperature Unit</p>
      <div>
        <Button type={isCelsius ? 'primary' : 'default'} onClick={() => setIsCelsius(true)}>
          Celsius (°C)
        </Button>
        &nbsp;&nbsp;
        <Button type={!isCelsius ? 'primary' : 'default'} onClick={() => setIsCelsius(false)}>
          Fahrenheit (°F)
        </Button>
      </div>

      <br />
      <p className='temperatureSetting'>Show Degrees</p>
      <div>
        <Button type={showDegreeUnit ? 'primary' : 'default'} onClick={() => setShowDegreeUnit(true)}>
          Yes
        </Button>
        &nbsp;&nbsp;

        <Button type={!showDegreeUnit ? 'primary' : 'default'} onClick={() => setShowDegreeUnit(false)}>
          No
        </Button>
      </div>

      <br />

      <p className='temperatureSetting'>Show Animations</p>

      <div>
        <Button type={showAnimations ? 'primary' : 'default'} onClick={() => setShowAnimations(true)}>
          Yes
        </Button>
        &nbsp;&nbsp;

        <Button type={!showAnimations ? 'primary' : 'default'} onClick={() => setShowAnimations(false)}>
          No
        </Button>
      </div>
      <br />

      <p className='temperatureSetting'>Weather Token</p>
      <div>
        <Input value={weatherToken} onChange={(e) => setWeatherToken(e.target.value)} />
      </div>
      <br />

      <p className='temperatureSetting'>AQI Token</p>
      <div>
        <Input value={AQIToken} onChange={(e) => setAQIToken(e.target.value)} />
      </div>
    </Modal>
  );
}

export default Settings