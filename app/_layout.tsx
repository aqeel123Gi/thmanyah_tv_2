import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { initTVButtons } from '@/helpers/tvButtons';
import AppConfig from '@/constants/AppConfig';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Disable reanimated warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// تهيئة إعدادات التطبيق الأساسية


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    IBMPlexSansArabicRegular: require("../assets/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Regular.otf"),
    IBMPlexSansArabicMedium: require("../assets/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Medium.otf"),
    IBMPlexSansArabicBold: require("../assets/fonts/IBM-Plex-Sans-Arabic/IBMPlexSansArabic-Bold.otf")
  });

  initTVButtons();
  

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
    </ThemeProvider>
  );

}
