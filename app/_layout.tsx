import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for user session
    const checkUser = async () => {
      try {
        const userSession = await AsyncStorage.getItem('user_session');
        const inSignupGroup = segments[0] === 'signup';

        if (!userSession && !inSignupGroup) {
          // No user, redirect to signup
          // Need to wait for navigation to be ready, but in expo router simple replace usually works
          // slightly better to delay or use a layout effect, but useEffect is standard.
          router.replace('/signup');
        } else if (userSession && inSignupGroup) {
          // User exists but on signup page, redirect to home
          router.replace('/');
        }
      } catch (e) {
        console.error('Failed to check user session', e);
      } finally {
        setIsReady(true);
      }
    };

    checkUser();
  }, [segments]);


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
