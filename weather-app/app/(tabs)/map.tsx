import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function MapScreen() {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject>();
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.6404517,
    longitude: 120.9745074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
  };
  useEffect(() => {
    userLocation();
  }, []);
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion} provider={PROVIDER_GOOGLE}>
        <Marker coordinate={mapRegion} title="My location" />
      </MapView>
      <TouchableOpacity onPress={userLocation}>
        <MaterialCommunityIcons
          style={styles.gps_icon}
          name="crosshairs-gps"
          size={25}
          color={'ghostwhite'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '95%',
  },
  gps_icon: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
    alignSelf: 'center',
  },
});
