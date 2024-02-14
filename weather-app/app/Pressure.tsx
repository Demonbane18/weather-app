import { StyleSheet, Text, View } from 'react-native';

export default function PressureScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pressure</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Pressure causes changes in the weather. We predict changes in the
          weather with the sudden changes in pressure.
        </Text>
        <Text style={styles.description}>
          High pressure means weather is more settled - wind is light, and there
          are fewer clouds.
        </Text>
        <Text style={styles.description}>
          Low pressure means weather is unsettled - it's cloudy, and there's a
          higher chance of rain or snow.
        </Text>
      </View>
      <Text style={styles.title}>How its calculated</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Pressure is measured with a barometer that has pressure sensors
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
