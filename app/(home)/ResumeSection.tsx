import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { VideoModel } from '@/models/video';
import { Colors } from '@/constants/Colors';
import { HomePageController } from './controller';


export default function ResumeSection({ videos, homePageController: states }: { videos: VideoModel[], homePageController: HomePageController }) {

  
  const activeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(activeAnim, {
      toValue: states.onLastPlayedVideo.get() ? 1 : 0,
      duration: 1000,
      easing: Easing.out(Easing.circle),
      useNativeDriver: true,
    }).start();
  }, [states.onLastPlayedVideo.get()]);


  return (
    states.lastPlayedVideo.get()!=null && <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { 
            opacity: activeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.6, 1]
            }), 
            transform: [{ 
              scale: activeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.1]
              })
            }] 
          },
        ]}
      >
        <Text style={styles.title}>استكمال المشاهدة</Text>
        <View style={{ marginBottom: 24 }}>
          <Image
            source={{ uri: states.lastPlayedVideo.get()!.thumbnailImagePath }}
            style={{ width: 120, height: 130, borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.videoTitle}>{states.lastPlayedVideo.get()!.title}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 50,
    bottom: 130,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 20,
    width: 200,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'IBMPlexSansArabicRegular',
    color: Colors.dark.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  videoTitle: {
    fontSize: 20,
    fontFamily: 'IBMPlexSansArabicBold',
    color: '#db2b00',
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 18,
    color: Colors.dark.text,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  resumeButton: {
    backgroundColor: Colors.dark.tint,
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.dark.text,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.background,
  },
});
