import { ThemedText } from '@/components/ThemedText';
import Spinner from '@/components/Spinner';
import { VideoModel } from '@/models/video';
import React, {useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Video from 'react-native-video';
import { HomePageController } from '../controller';
import { VideoState } from '@/constants/videoState';
import { checkConnectivity, ConnectivityState } from '@/helpers/checkConnectivity';
import { useTVButtons } from '@/helpers/tvButtons';


export default function VideoPlayer({ videos, homePageController: states }: { videos: VideoModel[], homePageController: HomePageController }) {



    const videoRef = useRef<any>(null);
    const [paused, setPaused] = useState(false);

    const [initState,setInitState] = useState<boolean>(true);
    const [videoState,setVideoState] = useState<VideoState>(VideoState.onStart);
    const [connectivityState,setConnectivityState] = useState<ConnectivityState>(ConnectivityState.internet);
    const [visibility,visibilityState] = useState<boolean>(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    var duration:number = 99999;


    useTVButtons({
      key: "Video Player",
      condition: ()=>states.isVideoPlaying(),
      actionMap: {
        'left': () => {
            const newTime = Math.max((states.lastPlayedVideoSeek.get() || 0) - 5, 0);
            videoRef.current.seek(newTime);
          
        },
        'right': () => {
            const newTime = Math.min((states.lastPlayedVideoSeek.get() || 0) + 30, duration);
            videoRef.current.seek(newTime);
        },
        'enter': () => {
          setPaused(prev => !prev);
        }
      },
      onBackButtonPressed: ()=>{

        states.lastPlayedVideo.set(states.videoPlaying.get());

        states.videoPlaying.set(null);
        states.saveLastPlayedVideo(states.videoPlaying.get()!.id, states.lastPlayedVideoSeek.get());
      }
    });



    // Fade in animation when video starts playing
    useEffect(() => {
        if (states.isVideoPlaying()) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [states.isVideoPlaying()]);

    useEffect(() => {
        if (states.isVideoPlaying()) {
            const timer = setTimeout(() => {
                visibilityState(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [states.isVideoPlaying()]);


    useEffect(() => {
      const interval = setInterval(async () => {
        console.log(await checkConnectivity());
        setConnectivityState(await checkConnectivity());
      }, 2000); // كل 5 ثواني
      return () => clearInterval(interval);
    }, []);

    return (
      states.isVideoPlaying() && 
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        
      
        <View style={{opacity: visibility?1:0}}>
        <View style={{ position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center'}}>
        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 24, paddingVertical: 8 }}>
          <ThemedText style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
            {videos[states.currentIndex.get()].title}
          </ThemedText>
        </View>
      </View>
        


        <Video
          ref={videoRef}
          hasTVPreferredFocus = {true}
          focusable = {true}
          disableFocus ={false}
          source={{ uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }} // HLS
          style={styles.video}
          controls={true}
          resizeMode="contain"
          onError={(e) => {
            if (e.error.errorStackTrace!.includes('ERROR_CODE_IO_NETWORK_CONNECTION_FAILED')) {
              console.log('OK');
            }
          }}
          
          paused = {paused}
          onBuffer={() => {
            setVideoState(VideoState.loading);
          }}
          onProgress={(progress) => {
            setVideoState(VideoState.inProgress);
            states.lastPlayedVideoSeek.set(progress.currentTime);
            console.log(progress.playableDuration);
            //duration = progress.playableDuration;
            setInitState(false);
          }}
          onLoadStart={(e) => {
            // if (states.onLastPlayedVideo.get()) {
            //   currentTimeRef.current = states.lastPlayedVideoSeek.get();
            // }
          }}
          onLoad={(data) => {
            duration = data.duration;
            if (states.onLastPlayedVideo.get() && videoRef.current) {
              const targetSeconds = states.lastPlayedVideoSeek.get() || 0;
              try {
                videoRef.current.seek(targetSeconds);
              } catch (err) {
                console.log('seek error:', err);
              }
            }
          }}
        />
      </View>


      {initState && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black'}} />
      )}


      {(videoState === VideoState.loading || videoState === VideoState.onStart) && (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <Spinner overlay={true} />
          {connectivityState !== ConnectivityState.internet && (
            <View style={{ marginTop: 160, alignItems: 'center', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 16 }}>
              <ThemedText style={{height:30, color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
                {connectivityState === ConnectivityState.noConnection && "لا يوجد اتصال بالشبكة :("}
                {connectivityState === ConnectivityState.noInternet && "لا يوجد وصول إلى الإنترنت :("}
              </ThemedText>
              <ThemedText style={{height:30, color: '#aaa', fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
                {connectivityState === ConnectivityState.noConnection && "تأكد من تشغيل الراوتر وتحقق من إعدادات الاتصال لديك"}
                {connectivityState === ConnectivityState.noInternet && "تأكد من تفعيل الإنترنت وجودة السرعة لديك"}
              </ThemedText>
            </View>
          )}
        </View>
      )}
      
      

      


    </Animated.View>
  );

};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  player: { flex: 1 },
});