import { WeatherForecast } from '@/app/(tabs)/home';
import { View, Text, StyleSheet, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';

const ForecastItem = ({ forecast }: { forecast: WeatherForecast }) => {
  return (
    <BlurView intensity={30} style={styles.container}>
      <Text style={styles.date}>
        {dayjs(forecast.dt * 1000).format('ddd ha')}
      </Text>
      <Image
        style={styles.currentWeatherIcon}
        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
      />
      <Text style={styles.pop}>
        <FontAwesome name="umbrella" size={15} color={'skyblue'} />{' '}
        {Math.round(forecast.pop * 100)}%
      </Text>
      <Text style={styles.temp}>{Math.round(forecast.main.temp)}°</Text>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    aspectRatio: 3 / 4,
    borderRadius: 10,
    alignItems: 'center',
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
    paddingBottom: 10,
  },
  date: {
    fontFamily: 'Inter',
    color: 'lightgray',
    fontSize: 16,
    paddingTop: 10,
  },
  pop: {
    fontFamily: 'Inter',
    color: 'skyblue',
    fontSize: 16,
  },
});

export default ForecastItem;
