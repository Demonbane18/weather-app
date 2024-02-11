import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  AmaticSC_400Regular,
  AmaticSC_700Bold,
} from '@expo-google-fonts/amatic-sc';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from '@/components/AnimatedSplashScreen';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    InterSemi: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    InterBlack: Inter_900Black,
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,

    Amatic: AmaticSC_400Regular,
    AmaticBold: AmaticSC_700Bold,
  });

  // Expo Router uses fontError Boundaries to catch fontErrors in the navigation tree.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  const showAnimatedSplash = !appReady || !splashAnimationFinished;
  if (showAnimatedSplash) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={(isCancelled) => {
          if (!isCancelled) {
            setSplashAnimationFinished(true);
          }
        }}
      />
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }} entering={FadeIn}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{}}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
