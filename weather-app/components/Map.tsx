import { useAssets } from 'expo-asset';
import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
type Props = {
  onMapPress: (coordinates: [number, number]) => void;
};

const Map = (props: Props) => {
  const { onMapPress } = props;
  const [errorMsg, setErrorMsg] = useState('');
  const [assets] = useAssets([require('../assets/index.html')]);
  const [htmlString, setHtmlString] = useState<string>();

  const dimensions = useWindowDimensions();

  const webViewRef = useRef<WebView | null>();

  useEffect(() => {
    userLocation();
    if (assets) {
      fetch(assets[0].localUri || '')
        .then((res) => res.text())
        .then((html) => {
          setHtmlString(html);
        });
    }
  }, [assets]);

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
  };
  const messageHandler = (e: WebViewMessageEvent) => {
    const coords = JSON.parse(e.nativeEvent.data) as [number, number];
    onMapPress(coords);
  };

  if (!htmlString) {
    return <></>;
  }

  return (
    <WebView
      ref={(r) => (webViewRef.current = r)}
      injectedJavaScript=""
      source={{
        html: htmlString,
      }}
      javaScriptEnabled
      originWhitelist={['*']}
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      scrollEnabled={false}
      overScrollMode="never"
      geolocationEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scalesPageToFit={false}
      containerStyle={{ flex: 1 }}
      onMessage={messageHandler}
    />
  );
};

export default Map;
