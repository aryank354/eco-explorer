import { useState } from 'react';

export const useOneTimeLocation = () => {
  const [isFetching, setIsFetching] = useState(false);
  
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation is not supported.'));
      }

      setIsFetching(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsFetching(false);
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setIsFetching(false);
          reject(new Error(err.message));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  return { getLocation, isFetching };
};