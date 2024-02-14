import { StyleSheet, Text, View, Image } from 'react-native';

export default function WindScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wind</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          About wind is air in motion, travelling between areas of different
          pressure. The wind speed is the average distance covered by air in a
          short period of time. Gusts are brief bursts of wind that are usually
          under 20 seconds.
        </Text>
      </View>
      <Text style={styles.title}>Wind speeds</Text>
      <View style={styles.container}>
        <Image
          style={styles.currentWeatherIcon}
          source={require('@/assets/images/windforce.png')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 10,
  },
  title: {
    fontFamily: 'InterSemi',
    fontSize: 20,
    color: 'ghostwhite',
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 16,
    justifyContent: 'flex-start',
    color: 'ghostwhite',
  },
  currentWeatherIcon: {
    width: 350,
    height: 500,
    resizeMode: 'contain',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
