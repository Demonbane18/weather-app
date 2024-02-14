import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import * as Location from 'expo-location';
import { FlatList } from 'react-native-gesture-handler';
import ForecastItem from '@/components/ForecastItem';
import { Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import BottomSheet from '@gorhom/bottom-sheet';

const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
const bgImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg';
const unit = 'metric';

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
};
type Sys = {
  country: string;
};

type Weather = {
  name: string;
  main: MainWeather;
  sys: Sys;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};

export type WeatherForecast = {
  main: MainWeather;
  dt: number;
};

export default function HomeScreen() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '95%'], []);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();
  const [snapPoint, setSnapPoint] = useState<Number>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
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

  const fetchForecast = async () => {
    // api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid={API key}
    if (!location) {
      return;
    }

    const results = await fetch(
      `${BASE_URL}/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPEN_WEATHER_KEY}&units=${unit}`
    );
    const data = await results.json();
    // console.log(JSON.stringify(data, null, 2));
    setForecast(data.list);
  };

  function setCountryName() {
    const country = weather?.sys.country;
    switch (country) {
      case 'PH':
        return 'Philippines';
      case 'US':
        return 'United States';
      default:
        return 'Invalid country';
      //increase country names
    }
  }

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    setLoading(true);
    setSnapPoint(index);
    setLoading(false);
  }, []);

  if (!weather) {
    return <ActivityIndicator />;
  }
  return (
    <ImageBackground source={{ uri: bgImage }} style={styles.container}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <LottieView
          source={
            weather.weather[0].main === 'Rain'
              ? require('@/assets/lottie/rain.json')
              : require('@/assets/lottie/sunny.json')
          }
          style={{
            width: 200,
            aspectRatio: 1,
          }}
          loop
          autoPlay
        />
      </View>

      <StatusBar style="light" />
      <BottomSheet
        style={styles.bottomSheetContainer}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: 'black',
        }}
        handleIndicatorStyle={{
          backgroundColor: 'darkgray',
        }}
      >
        {snapPoint === 0 ? (
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingBottom: 50,
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.temp}>
                {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.location}>{weather.name}</Text>
              <Text style={styles.country}>{setCountryName()}</Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingBottom: 50,
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.temp}>
                {Math.round(weather.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
              </Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.location}>{weather.name}</Text>
              <Text style={styles.country}>{setCountryName()}</Text>
              <Text style={styles.location}>tets</Text>
            </View>
          </View>
        )}

        <View style={styles.contentContainer}>
          <FlatList
            data={forecast}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flexGrow: 0,
              height: 150,
              marginBottom: 40,
            }}
            contentContainerStyle={{
              gap: 10,
              paddingHorizontal: 10,
            }}
            renderItem={({ item }) => <ForecastItem forecast={item} />}
          />
        </View>
      </BottomSheet>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'InterBlack',
    fontSize: 30,
    color: 'lightgray',
    marginHorizontal: 0,
    marginTop: 0,
    padding: 0,
  },
  country: {
    fontFamily: 'Inter',
    fontSize: 20,
    color: 'lightgray',
  },
  main: {
    fontFamily: 'Inter',
    fontSize: 30,
    color: 'lightgray',
  },
  temp: {
    fontFamily: 'Inter',
    fontSize: 60,
    color: 'orange',
    marginHorizontal: 0,
    marginTop: 0,
    paddingRight: 5,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: '600',
    padding: 20,
  },
});
