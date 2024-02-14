import { StyleSheet, Text, View } from 'react-native';

export default function HumidityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relative Humidity</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Humidity is the amount of water vapor in the air. High humidity in the
          heat makes it harder for sweat to evaporate from our skin, so we feel
          warmer. If it's cool and humid, we feel cooler.
        </Text>
      </View>
      <Text style={styles.title}>Humidity Scale</Text>
      <View style={styles.container}>
        <Text style={styles.description}>Very dry: 20% and lower</Text>
        <Text style={styles.description}>Dry: 21%-40%</Text>
        <Text style={styles.description}>Comfortable: 41%-60%</Text>
        <Text style={styles.description}>Humid: 61%-80%</Text>
        <Text style={styles.description}>Very Humid: 61% and higher</Text>
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
