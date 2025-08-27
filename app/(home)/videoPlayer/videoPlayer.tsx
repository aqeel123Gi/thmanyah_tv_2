import { ThemedText } from '@/components/ThemedText';
import Spinner from '@/components/Spinner';
import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import { HomePageController } from '../controller';
import { VideoState } from '@/constants/videoState';
import { ConnectivityState } from '@/helpers/checkConnectivity';
import useVideoPlayerController from './controller';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';



export default function VideoPlayer({ homePageController: homePageController }: { homePageController: HomePageController }) {


    const controller = useVideoPlayerController(homePageController);
  

    return (
      homePageController.isVideoPlaying() && 


      <Animated.View style={[styles.container, { opacity: controller.animations.startBlackScreenOpacityAnimation }]}>
      
          <Video
            ref={controller.videPlayerReference}
            
            source={{ uri: homePageController.videoPlaying.get()!.videoPath }} // HLS
            style={styles.video}
            controls={false}
            resizeMode="contain"
            onError={(e) => {
              if (e.error.errorStackTrace!.includes('ERROR_CODE_IO_NETWORK_CONNECTION_FAILED')) {
                console.log('OK');
              }
            }}

            paused={controller.states.pausedState.get()}
            
            onBuffer={() => {
              controller.states.videoState.set(VideoState.loading);
            }}
            
            onProgress={(progress) => {
              controller.states.videoState.set(VideoState.inProgress);
              homePageController.lastPlayedVideoSeek.set(progress.currentTime);
              controller.states.currentTimeState.set(progress.currentTime);
              controller.states.initState.set(false);
            }}
            onLoadStart={(e) => {
              if (homePageController.onLastPlayedVideo.get()) {
                const player = controller.videPlayerReference.current as { seek: (time: number | null) => void } | null;
                player!.seek(homePageController.lastPlayedVideoSeek.get()!);
              }
            }}
            progressUpdateInterval={200}
            onLoad={(data) => {
              controller.states.durationState.set(data.duration);
              if (homePageController.onLastPlayedVideo.get() && controller.videPlayerReference.current) {
                const targetSeconds = homePageController.lastPlayedVideoSeek.get() || 0;
                try {
                  // controller.videPlayerReference.current.seek(targetSeconds);
                } catch (err) {
                  console.log('seek error:', err);
                }
              }
            }}
          />
          





        <LinearGradient
          colors={["rgba(0,0,0,0.9)",  "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ position: "absolute", top: 0, width: "100%", paddingHorizontal: 40, paddingBottom: 40, paddingTop: 30 }}
        >
        {controller.states.visibilityState.get() ? (
            <ThemedText style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'right' }}>
            {homePageController.videoPlaying.get()!.title}
          </ThemedText>
          ) : null}
        </LinearGradient>

        <LinearGradient
          colors={["rgba(0,0,0,0.9)",  "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={{ position: "absolute", bottom: 0, width: "100%", paddingHorizontal: 20, paddingBottom: 20, paddingTop: 50 }}
        >
          {/* Seeker */}
          <Slider
            value={controller.states.currentSeekingState.get()??controller.states.currentTimeState.get()}
            minimumValue={0}
            maximumValue={controller.states.durationState.get()}
            // onSlidingComplete={onSeek}
            minimumTrackTintColor="red"
            maximumTrackTintColor="white"
            thumbTintColor="white"
          />

            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, width: '100%' }}>
              <View style={{ width: 180 }} />
              {/* Play/Pause button in the center */}
              <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                  onPress={controller.actions.togglePlayPause}
                  style={{
                    backgroundColor: "#222",
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                >
                  <ThemedText style={{ color: "white", fontSize: 16 }}>
                    {controller.states.pausedState.get() ? "▶️ Play" : "⏸ Pause"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: 150, marginRight: 30 }}>
                <ThemedText style={{ color: "white", fontSize: 20, marginLeft: 0 }}>
                  {new Date((controller.states.currentSeekingState.get() ?? controller.states.currentTimeState.get()) * 1000).toISOString().substr(11, 8)}
                </ThemedText>
                <ThemedText style={{ color: "white", fontSize: 20 }}>
                  /
                </ThemedText>
                <ThemedText style={{ color: "white", fontSize: 20, marginRight: 0 }}>
                  {new Date(controller.states.durationState.get() * 1000).toISOString().substr(11, 8)}
                </ThemedText>
              </View>
              
            </View>
        </LinearGradient>



      {controller.states.initState.get() && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black'}} />
      )}


      {(controller.states.videoState.get() === VideoState.loading || controller.states.videoState.get() === VideoState.onStart) && (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <Spinner overlay={true} />
          {controller.states.connectivityState.get() !== ConnectivityState.internet && (
            <View style={{ marginTop: 160, alignItems: 'center', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 16 }}>
              <ThemedText style={{height:30, color: '#fff', fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
                {controller.states.connectivityState.get() === ConnectivityState.noConnection && "لا يوجد اتصال بالشبكة :("}
                {controller.states.connectivityState.get() === ConnectivityState.noInternet && "لا يوجد وصول إلى الإنترنت :("}
              </ThemedText>
              <ThemedText style={{height:30, color: '#aaa', fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
                {controller.states.connectivityState.get() === ConnectivityState.noConnection && "تأكد من تشغيل الراوتر وتحقق من إعدادات الاتصال لديك"}
                {controller.states.connectivityState.get() === ConnectivityState.noInternet && "تأكد من تفعيل الإنترنت وجودة السرعة لديك"}
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