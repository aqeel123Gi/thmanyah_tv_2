import React from 'react';
import { View } from 'react-native';
import { mockVideos } from '../../data/movies';
import VideoList from './videoList';
import HomeBageBackground from './background';
import useHomePageController from './controller';
import VideoPlayer from './videoPlayer/videoPlayer';
import ResumeSection from './ResumeSection';

export default function HomeScreen() {
  
  const { 
    states, 
    mainScreenViewRef,
  } = useHomePageController(mockVideos);

  return (
    <View 
      ref={mainScreenViewRef} 
      style={styles.container}
      focusable={true}
      hasTVPreferredFocus={true}
      >

      <HomeBageBackground videos={mockVideos} homePageController={states}/>
      <ResumeSection videos={mockVideos} homePageController={states}/>
      <VideoPlayer videos={mockVideos} homePageController={states}/>
      <VideoList videos={mockVideos} homePageController={states}/>

    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#000000'
  }
};
