import { GetCacheValue } from '@/utils/cacheServiceHelper';
import React from 'react';

const TemperatureConverter = ({ temperatureValue, unit }) => {
    const getDegreeType = GetCacheValue("ShowDegree")
    const convertTemperature = (value, targetUnit) => {
        if (targetUnit === 'C') {
            return ((value - 32) * 5) / 9;
        }
        else if (targetUnit === 'F') {
            return value;
        }
        return value;
    };

    const convertedValue = convertTemperature(temperatureValue, unit);

    return (
        <span>
            {Math.floor(convertedValue)} {getDegreeType === 'true' ? 
            <span className="tempDegree">&#176;</span> 
            : ''}
        </span>
    );
};

export default TemperatureConverter;
