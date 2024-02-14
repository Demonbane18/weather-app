import { StyleSheet, Text, View } from 'react-native';

export default function PrecipitationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Precipitation</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Precipitation is any water that forms in the atmosphere and falls to
          the grounds. it includes rain, drizzle, snow, sleet and hail.
        </Text>
      </View>
      <Text style={styles.title}>Types of precipitation</Text>
      <View style={styles.container}>
        <Text style={styles.description}>
          Rain or snow falls when clouds become filled with water droplets .
          When the water droplets get too heavy, they fall from the cloud. The
          difference between light rain and drizzle is that you can feel drops,
          it's rain.
        </Text>
        <Text style={styles.description}>
          Rain that falls from clouds but freezes before it reaches Earth is
          sleet or ice pellets. Hail comes from cold storm clouds.
        </Text>
        <Text style={styles.description}>
          Snow needs temperatures to be near to freezing to fall. Snowflakes
          have different patterns, depending on temperature and humidity.
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
