import { GetCacheValue } from "./cacheServiceHelper";

const Weather_URL = 'http://api.weatherapi.com/v1/';
const AQI_URL = 'https://api.waqi.info/feed/'

const Weather_KEY = GetCacheValue('WeatherToken')
const AQI_KEY = GetCacheValue('AQIToken')
const TIMEOUT = 10000;
const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];

export const apiClient = async (path, method = 'GET', data = null, isAqi = false) => {
  let apiUrl = '';
  if(isAqi){
    const aqiApiUrl = `${AQI_URL}${path}/?token=${AQI_KEY}`;
    apiUrl = aqiApiUrl
  }
  else{
    const weatherApiUrl = `${Weather_URL}${path}&key=${Weather_KEY}`;
    apiUrl = weatherApiUrl
  }

  const getValidMethod = (method) => {
    if (validMethods.includes(method)) {
      return method;
    }
    // Provide a default method (e.g., GET) or handle the error as needed
    console.error('Invalid HTTP method:', method);
    return 'GET';
  };

  const options = {
    method: getValidMethod(method),
    headers: {
      ...(method !== 'GET' && { 'Content-Type': 'application/json' }),
    },
    body: data && JSON.stringify(data),
  };

  try {
    const response = await Promise.race([
      fetch(apiUrl, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), TIMEOUT)
      ),
    ]);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`API request error: ${error.message}`);
  }
};