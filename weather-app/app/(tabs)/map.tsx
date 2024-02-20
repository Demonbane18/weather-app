import React, { useState, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import latLngToTile from '@/assets/functions/tileconverter';

export default function MapScreen() {
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<Location.LocationObject>();
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.6404517,
    longitude: 120.9745074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [tileCoords, setTileCoords] = useState({
    x: 856,
    y: 469,
    z: 10,
  });
  const [layer, setLayer] = useState<string>('clouds_new');

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
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const zoomLevel = 10;
    const tileCoords = latLngToTile({ latitude, longitude }, zoomLevel);
    setTileCoords({
      x: tileCoords.x,
      y: tileCoords.y,
      z: zoomLevel,
    });
    console.log(location.coords.latitude, location.coords.longitude);
    console.log(tileCoords.x, tileCoords.y, tileCoords.z);
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
      <Text style={styles.description}>test</Text>
      <Image
        // style={styles.currentWeatherMap}
        source={{
          uri: `https://tile.openweathermap.org/map/${layer}/${tileCoords.z}/${tileCoords.x}/${tileCoords.y}.png?appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_KEY}`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontFamily: 'Inter',
    fontSize: 25,
    color: 'ghostwhite',
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
  currentWeatherMap: {
    width: '100%',
    height: '95%',
    resizeMode: 'contain',
    opacity: 0.7,
  },
});
