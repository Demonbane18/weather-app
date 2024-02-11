import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;

type Weather = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('Location:', location);
      setLocation(location);
    })();
  }, []);

  const fetchWeather = async () => {
    if (!location) {
      return;
    }
    const unit = 'metric';
    const results = await fetch(
      `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${unit}&appid=${OPEN_WEATHER_KEY}`
    );
    const data = await results.json();
    console.log(JSON.stringify(data, null, 2));
    setWeather(data);
  };

  if (!weather) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.location}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
      <Link href="/splash/" style={styles.link}>
        <Text style={styles.linkText}>Go to test splash screen!</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter',
    fontSize: 30,
    color: 'lightgray',
  },
  temp: {
    fontFamily: 'InterBlack',
    fontSize: 70,
    color: 'gray',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
