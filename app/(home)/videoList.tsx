
import { VideoModel } from '@/models/video';
import React, { useEffect, useRef } from 'react';
import { FlatList, Image, StyleSheet, Animated, Easing} from 'react-native';
import { HomePageController } from './controller';



export default function VideoList({ homePageController: states }: { homePageController: HomePageController }) {


  const flatListRef = useRef<FlatList<VideoModel>>(null);
  const animations = useRef(states.mockVideos.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      const strength = (index - states.currentIndex.get() === 0) ? 0 : (Math.abs(index - states.currentIndex.get()) === 1 ? 0.6 : 1);
      Animated.timing(anim, {
        toValue: states.isVideoPlaying() ? 130 : states.onLastPlayedVideo.get() ? 120 : strength * 50, // تصعيد العنصر Focused
        duration: states.isVideoPlaying() ? 1000 : states.onLastPlayedVideo.get() ? 2000 : strength * 2000 + 500,
        easing: Easing.out(Easing.circle),
        useNativeDriver: true,
      }).start();
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: states.currentIndex.get(),
        animated: true,
        viewPosition: 0.5, // Center the focused item
      });
    }
    });
    
  }, [states.currentIndex.get(), states.isVideoPlaying(), states.onLastPlayedVideo.get()]);

  // useEffect(() => {
  //     if(flatListRef.current){
  //       flatListRef.current.scrollToIndex({
  //         index: states.currentIndex.get(),
  //         animated: true,
  //         viewPosition: 0.5
  //       });
  //     }
  //   }, [states.currentIndex.get()]);

  
    return (
        <FlatList
        focusable={true}
        ref={flatListRef}
        style={styles.list}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        data={states.mockVideos}
        renderItem={({ item, index }) => (
            <Animated.View style={[styles.thumbnail, {transform: [{translateY: animations[index]}]}]}>
                <Image
                    source={{ uri: item.thumbnailImagePath }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
            </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        />
    );
};

const styles = StyleSheet.create({
  list: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
  },
  thumbnail: {
    height: 130,
    width: 120,
    marginRight: 5,
    marginLeft: 5,
  },
  title: {
    fontSize: 14
  },
});
