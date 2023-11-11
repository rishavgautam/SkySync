// const BASE_URL = '/api/genericApi';
const BASE_URL = 'https://api.coindesk.com/';

const TIMEOUT = 10000; // 10 seconds (adjust as needed)
const validMethods = ['GET', 'POST', 'PUT', 'DELETE']; // Define valid HTTP methods

export const apiClient = async (path, method = 'GET', data = null) => {
  const apiUrl = `${BASE_URL}${path}`;

  const getValidMethod = (method) => {
    if (validMethods.includes(method)) {
      return method;
    }
    // Provide a default method (e.g., GET) or handle the error as needed
    console.error('Invalid HTTP method:', method);
    return 'GET'; // Fallback to a safe default
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
