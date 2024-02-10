import { ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=14.640417&lon=120.973394&units=metric&appid=6be4c73603d24111b5b1a6972d8bd56d`;
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
  const [weather, setWeather] = useState<Weather>();
  const fetchWeather = async () => {
    // fetch data
    console.log('fetch data');
    const results = await fetch(url);
    const data = await results.json();
    console.log(JSON.stringify(data, null, 2));
    setWeather(data);
  };
  useEffect(() => {
    fetchWeather();
  }, []);

  if (!weather) {
    return <ActivityIndicator />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.location}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp)}°</Text>
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
});
