import React from 'react';
import { View } from 'react-native';
import VideoList from './videoList';
import HomeBageBackground from './background';
import useHomePageController from './controller';
import VideoPlayer from './videoPlayer/videoPlayer';
import ResumeSection from './ResumeSection';

export default function HomeScreen() {
  
  const { 
    states: controller, 
    mainScreenViewRef,
  } = useHomePageController();

  return (
    <View 
      ref={mainScreenViewRef} 
      style={styles.container}
      focusable={true}
      hasTVPreferredFocus={true}
      >

      <HomeBageBackground homePageController={controller}/>
      <ResumeSection homePageController={controller}/>
      <VideoPlayer homePageController={controller}/>
      <VideoList homePageController={controller}/>

    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000000'
  }
};
