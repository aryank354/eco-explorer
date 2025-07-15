const API_URL = 'http://localhost:3001/api';

export const fetchScenicRoute = async (startCoords, endCoords) => {
  const response = await fetch(`${API_URL}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startCoords, endCoords }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch route');
  }

  const data = await response.json();
  return data.route;
};