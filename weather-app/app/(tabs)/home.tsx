import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { FlatList } from 'react-native-gesture-handler';
import ForecastItem from '@/components/ForecastItem';
import DataItem from '@/components/DataItem';
import { Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';

const BASE_URL = `https://api.openweathermap.org/data/2.5`;
const OPEN_WEATHER_KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY;
const bgImage =
  'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/vertical-images/1.jpg';
const unit = 'metric';

export type MainWeather = {
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

export type Weather = {
  name: string;
  main: MainWeather;
  sys: Sys;
  clouds: [
    {
      all: string;
    }
  ];
  rain: [
    {
      '1h': number;
    }
  ];
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
  pop: number;
  weather: [
    {
      id: string;
      main: string;
      description: string;
      icon: string;
    }
  ];
};
export type WeatherInfo = {
  data_type: string;
  data_value: string;
  data_unit: string;
  description: string;
};

export default function HomeScreen() {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '95%'], []);
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState('');
  const [weather, setWeather] = useState<Weather>();
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo[]>();
  const [forecast, setForecast] = useState<WeatherForecast[]>();
  const [snapPoint, setSnapPoint] = useState<Number>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchForecast();
      fetchWeatherInfo();
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
      // console.log('Location:', location);
      setLocation(location);
    })();
  }, []);

  const fetchWeather = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${unit}&appid=${OPEN_WEATHER_KEY}`
    );
    const data = await results.json();
    // console.log(JSON.stringify(data, null, 2));
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

  const fetchWeatherInfo = async () => {
    if (!location) {
      return;
    }
    const results = await fetch(
      `${BASE_URL}/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=${unit}&appid=${OPEN_WEATHER_KEY}`
    );
    const data = await results.json();

    // console.log('Humidity: ', JSON.stringify(data.main.humidity));
    // console.log('Pressure: ', JSON.stringify(data.main.pressure));
    const raining = data?.rain?.['1h'] ? data?.rain?.['1h'] : 0;
    //can only get rain data when its raining....
    // console.log('Precipitation: ', JSON.stringify(raining));
    // console.log('Wind: ', JSON.stringify(data.wind.speed));
    // console.log('Cloudiness: ', JSON.stringify(data.clouds.all));
    const weatherInfo = [
      {
        data_type: 'humidity',
        data_value: data.main.humidity,
        data_unit: '%',
        description: 'Humidity now',
      },
      {
        data_type: 'pressure',
        data_value: data.main.pressure,
        data_unit: 'hPa',
        description: 'Pressure now',
      },
      {
        data_type: 'precipitation',
        data_value: raining,
        data_unit: 'mm/h',
        description: raining == 0 ? 'No Precipitation' : 'Raining now',
      },
      {
        data_type: 'wind',
        data_value: data.wind.speed,
        data_unit: unit === 'metric' ? 'm/s' : 'mph',
        description: 'Wind Speed now',
      },
      {
        data_type: 'cloud',
        data_value: data.clouds.all,
        data_unit: '%',
        description: 'Cloudiness now',
      },
    ];
    setWeatherInfo(weatherInfo);
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
          <BottomSheetView
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingBottom: 50,
            }}
          >
            <BottomSheetView
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <Text style={styles.temp}>{Math.round(weather.main.temp)}</Text>
                <Text style={styles.tempUnit}>
                  °{unit === 'metric' ? 'C' : 'F'}
                </Text>
              </View>
            </BottomSheetView>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'center',
                marginHorizontal: 10,
              }}
            >
              <Text style={styles.location}>{weather.name}</Text>
              <Text style={styles.country}>{setCountryName()}</Text>
            </View>
          </BottomSheetView>
        ) : (
          <BottomSheetView
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              paddingBottom: 50,
            }}
          >
            <BottomSheetView
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Text style={styles.bottomLocation}>{weather.name}, </Text>
              <Text style={styles.bottomCountry}>{setCountryName()}</Text>
            </BottomSheetView>
            <BottomSheetView
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Text style={styles.bottomTemp}>
                {Math.round(weather.main.temp)}
              </Text>
              <BottomSheetView
                style={{
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  alignSelf: 'center',
                }}
              >
                <Text style={styles.bottomTempUnit}>
                  {' '}
                  °{unit === 'metric' ? 'C' : 'F'}
                </Text>
                <Text style={styles.bottomFeelsLike}>feels like</Text>
                <Text style={styles.bottomFeelsLike}>
                  {Math.round(weather.main.feels_like)} °
                  {unit === 'metric' ? 'C' : 'F'}
                </Text>
              </BottomSheetView>

              <Image
                style={styles.currentWeatherIcon}
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              />
            </BottomSheetView>
            <BottomSheetView
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                marginLeft: 40,
              }}
            >
              <Text style={styles.description}>
                {weather.weather[0].description}
              </Text>
              <BottomSheetView
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                }}
              >
                <Text style={styles.temp_max}>
                  Max {Math.round(weather.main.temp_max)}°
                </Text>
                <Text style={styles.temp_min}>
                  Min {Math.round(weather.main.temp_min)}°
                </Text>
              </BottomSheetView>
            </BottomSheetView>
          </BottomSheetView>
        )}
        <BottomSheetView style={styles.contentContainer}>
          <FlatList
            data={weatherInfo}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flexGrow: 0,
              height: 100,
              marginBottom: 40,
            }}
            contentContainerStyle={{
              gap: 10,
              paddingHorizontal: 10,
            }}
            renderItem={({ item }) => <DataItem weatherInfo={item} />}
          />
        </BottomSheetView>
        <Text style={styles.header}>5 Day Forecast</Text>
        <BottomSheetView style={styles.contentContainer}>
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
        </BottomSheetView>
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
  header: {
    fontFamily: 'InterSemi',
    fontSize: 30,
    color: 'lightgray',
    marginHorizontal: 10,
    marginVertical: 10,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 0,
  },
  location: {
    fontFamily: 'InterBlack',
    fontSize: 30,
    color: 'lightgray',
    marginHorizontal: 0,
    marginTop: 0,
    padding: 0,
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 25,
    color: 'ghostwhite',
  },
  bottomLocation: {
    fontFamily: 'InterSemi',
    fontSize: 20,
    color: 'ghostwhite',
    marginHorizontal: 0,
    marginTop: 0,
    padding: 0,
  },
  bottomTempUnit: {
    fontFamily: 'InterSemi',
    fontSize: 30,
    color: 'ghostwhite',
    marginHorizontal: 0,
    marginTop: 0,
    padding: 0,
  },
  bottomFeelsLike: {
    fontFamily: 'Inter',
    fontSize: 15,
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
  bottomCountry: {
    fontFamily: 'InterSemi',
    fontSize: 20,
    color: 'ghostwhite',
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
  tempUnit: {
    fontFamily: 'InterSemi',
    fontSize: 30,
    color: 'orange',
    marginHorizontal: 0,
    marginTop: 0,
    padding: 0,
  },
  temp_max: {
    fontFamily: 'Inter',
    fontSize: 25,
    color: 'ghostwhite',
    marginRight: 20,
  },
  temp_min: {
    fontFamily: 'Inter',
    fontSize: 25,
    color: 'ghostwhite',
  },
  bottomTemp: {
    fontFamily: 'Inter',
    fontSize: 90,
    color: 'ghostwhite',
    marginHorizontal: 0,
    marginTop: 0,
    paddingRight: 5,
  },
  currentWeatherIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
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
