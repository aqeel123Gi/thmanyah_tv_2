import { ThemedText } from '@/components/ThemedText';
import { VideoModel } from '@/models/video';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View,Image, Pressable, StyleSheet, Animated, TVEventHandler, useTVEventHandler, Easing, I18nManager, TouchableOpacity } from 'react-native';
import { HomePageController } from './controller';




export default function HomeBageBackground({ videos, homePageController: states }: { videos: VideoModel[], homePageController: HomePageController }) {

  const isRTL = I18nManager.isRTL;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [currentVideoForView, setCurrentVideoForView] = useState(videos[states.currentIndex.get()]);


  function currentVideo(): VideoModel {
    if (states.onLastPlayedVideo.get()) {
      return states.lastPlayedVideo.get()!;
    } else {
      return videos[states.currentIndex.get()];
    }
  }


  useEffect(() => {
      Animated.timing(fadeAnim, {
      toValue: 0, // يخفي الصفحة الحالية
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentVideoForView(currentVideo()); // غير الصفحة
      Animated.timing(fadeAnim, {
        toValue: 1, // أظهر الصفحة الجديدة
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
      
    }, [currentVideo()]);

  
    return (
      <View style={[styles.container]}>
        <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
          <Image
              source={{ uri: currentVideoForView.backgroundImagePath }}
              style={styles.x}
              resizeMode="cover"
            />
        </Animated.View>

        <LinearGradient
          colors={["#000000ff", "#00000011"]}
          start={{ x: 0.95, y: 0 }}   // إذا RTL نبدأ من اليمين
          end={{ x: 0.4, y: 0 }} // إذا RTL نصل لمنتصف من اليمين
          style={styles.x}
        />
          <Animated.View style={[styles.column, {opacity: fadeAnim}]}>
            <ThemedText style={styles.title}>{currentVideoForView.title}</ThemedText>
            <ThemedText style={[styles.description, {height: 100}]}>{currentVideoForView.description}</ThemedText>
            <View style={styles.rowDetails}>
              <ThemedText style={styles.rowTitle}>مدة الفيديو</ThemedText>
              <View style={{width: 20}} />
              <ThemedText style={styles.description}>{`${Math.floor(currentVideoForView.minsOfRuntime / 60)}:${(currentVideoForView.minsOfRuntime % 60).toString().padStart(2, '0')}`}</ThemedText>
            </View>
          </Animated.View>
      </View>
    );

};

const styles = StyleSheet.create({
  x: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end' as const,
    backgroundColor: '#000000'
  },
  column: {
    position: 'absolute' as const,
    start: 50,
    width: '50%',
    top: 80,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
  },
  rowDetails: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
  },
  title: {
    lineHeight: 40,
    height: 50,
    color: '#db2b00',
    fontSize: 36,
    marginBottom: 10,
    fontFamily: 'IBMPlexSansArabicBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  description: {
    color: '#888888ff',
    fontSize: 16,
    fontFamily: 'IBMPlexSansArabicRegular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  rowTitle: {
    color: '#db2b00',
    fontSize: 16,
    fontFamily: 'IBMPlexSansArabicBold',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});