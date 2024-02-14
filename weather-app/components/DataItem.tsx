import { WeatherInfo } from '@/app/(tabs)/home';
import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';

const DataItem = ({ weatherInfo }: { weatherInfo: WeatherInfo }) => {
  const images = {
    humidity: require('@/assets/images/humidity.png'),
    pressure: require('@/assets/images/pressure.png'),
    wind: require('@/assets/images/wind.png'),
    precipitation: require('@/assets/images/precipitation.png'),
    cloudiness: require('@/assets/images/cloud.png'),
  };

  function fetchImage(data_type: string) {
    if (data_type === 'humidity') {
      return images.humidity;
    } else if (data_type === 'pressure') {
      return images.pressure;
    } else if (data_type === 'wind') {
      return images.wind;
    } else if (data_type === 'precipitation') {
      return images.precipitation;
    } else if (data_type === 'cloud') {
      return images.cloudiness;
    }
  }
  function goToScreen(data_type: string) {
    if (data_type === 'humidity') {
      router.replace('/Humidity');
    } else if (data_type === 'pressure') {
      router.replace('/Pressure');
    } else if (data_type === 'wind') {
      router.replace('/Wind');
    } else if (data_type === 'precipitation') {
      router.replace('/Precipitation');
    } else if (data_type === 'cloud') {
      router.replace('/Cloudiness');
    }
  }

  function redirectToScreen() {
    if (weatherInfo.data_type === 'humidity') {
      console.log('test');
    }
  }

  return (
    <BlurView intensity={30} style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          goToScreen(weatherInfo.data_type);
        }}
      >
        <Link href={'/Humidity'}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
          >
            <Image
              style={styles.infoImage}
              source={fetchImage(weatherInfo.data_type)}
            />

            <Text style={styles.date}>
              {weatherInfo.data_value} {weatherInfo.data_unit}
            </Text>
          </View>
          <Text style={styles.date}>{weatherInfo.description}</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </Link>
      </TouchableWithoutFeedback>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: 150,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: 'gainsboro',
    borderWidth: StyleSheet.hairlineWidth,
  },
  currentWeatherIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  temp: {
    fontFamily: 'InterBlack',
    fontSize: 25,
    color: 'white',
    marginVertical: 10,
  },
  date: {
    fontFamily: 'Inter',
    color: 'lightgray',
    fontSize: 16,
  },
  arrow: {
    fontFamily: 'InterSemi',
    color: 'ghostwhite',
    marginLeft: 120,
    fontSize: 16,
  },
  infoImage: {
    width: 30,
    height: 30,
  },
});

export default DataItem;
