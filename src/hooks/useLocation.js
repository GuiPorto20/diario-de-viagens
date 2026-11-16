import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Hook personalizado: pede permissão e devolve a localização atual do usuário
export default function useLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (active) setErrorMsg('Permissão de localização negada.');
          return;
        }
        const current = await Location.getCurrentPositionAsync({});
        if (active) {
          setLocation({
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          });
        }
      } catch (e) {
        if (active) setErrorMsg('Não foi possível obter a localização atual.');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { location, errorMsg };
}
