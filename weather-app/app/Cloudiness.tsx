import { StyleSheet, Text, View, Image } from 'react-native';

export default function CloudinessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cloudiness/Cloud Cover</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Cloud cover refers to the fraction of the sky obscured by clouds on
          average when observed from a particular location.
        </Text>
      </View>
      <Text style={styles.title}>Cloud Chart</Text>
      <View style={styles.container}>
        <Image
          style={styles.currentWeatherIcon}
          source={require('@/assets/images/cloud_cover.png')}
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
    height: 100,
    resizeMode: 'contain',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
