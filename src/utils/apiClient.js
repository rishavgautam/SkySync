

const BASE_URL = 'http://api.weatherapi.com/v1/';
const KEY = process.env.NEXT_PUBLIC_WEATHER_KEY
const TIMEOUT = 10000;
const validMethods = ['GET', 'POST', 'PUT', 'DELETE'];

export const apiClient = async (path, method = 'GET', data = null) => {
  const apiUrl = `${BASE_URL}${path}&key=${KEY}`;
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