import React from 'react';

const TemperatureConverter = ({ temperatureValue, unit, requireDegree }) => {

    const convertTemperature = (value, targetUnit) => {
        if (targetUnit === 'C') {
            return ((value - 32) * 5) / 9;
        }
        else if (targetUnit === 'F') {
            return value;
        }
        return value;
    };

    const convertedValue = convertTemperature(temperatureValue, unit, requireDegree);

    return (
        <span>
            {Math.floor(convertedValue)} {requireDegree ? 
            <span className="tempDegree">&#176;</span> 
            : ''}
        </span>
    );
};

export default TemperatureConverter;
