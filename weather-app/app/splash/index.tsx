import { View, Text, Button } from 'react-native';
import React from 'react';
import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const description = `
# Animated splash screen
`;

const DayDetailsScreen = () => {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Day 4: Splashscreen' }} />
      <Link href="/splash/animation" asChild>
        <Button title="Go to the animation" />
      </Link>

      <Link href="/splash/splash" asChild>
        <Button title="Splash screen animation" />
      </Link>
    </SafeAreaView>
  );
};

export default DayDetailsScreen;
