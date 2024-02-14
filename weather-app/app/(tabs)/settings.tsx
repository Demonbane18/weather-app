import { Switch, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SettingsScreen() {
  const [switchValue, setSwitchValue] = useState<boolean>(false);

  const toggleSwitch = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('units', value ? 'imperial' : 'metric');
    } catch (e) {
      // saving error
    }
    try {
      const units = await AsyncStorage.getItem('units');
      if (units !== null) {
      }
    } catch (e) {
      // error reading value
    }

    setSwitchValue(value);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.container}>
          <Text style={styles.subtitle}>UNITS</Text>

          {/*Setting the default value of state*/}
          {/*On change of switch onValueChange will be triggered*/}
        </View>
      </View>
      <View style={styles.switch}>
        <Text style={styles.description}>
          {switchValue ? 'Imperial' : 'Metric'}
        </Text>
        <Switch
          style={{ marginTop: 10 }}
          onValueChange={toggleSwitch}
          value={switchValue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 10,
  },
  switch: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'InterSemi',
    fontSize: 27,
    color: 'ghostwhite',
  },
  subtitle: {
    fontFamily: 'InterSemi',
    fontSize: 25,
    color: 'lightgray',
  },
  description: {
    fontFamily: 'InterSemi',
    fontSize: 20,
    justifyContent: 'center',
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
