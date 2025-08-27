import { VideoState } from "@/constants/videoState";
import { ConnectivityState, checkConnectivity } from "@/helpers/checkConnectivity";
import { useTVButtons } from "@/helpers/tvButtons";
import { RefObject, useEffect, useRef, useState } from "react";
import { Animated, Easing, View} from "react-native";
import { HomePageController } from "../controller";
import { getStateReference, StateReference } from "@/helpers/stateReference";


export interface VideoPlayerController{
  videPlayerReference: RefObject<null>,
  animations: VideoPlayerAnimations,
  states: VideoPlayerStates,
  actions: VideoPlayerActions
}

export interface VideoPlayerStates{
  initState: StateReference<boolean>,
  pausedState: StateReference<boolean>,
  durationState: StateReference<number>,
  currentTimeState: StateReference<number>,
  currentSeekingState: StateReference<number|null>,
  currentState: StateReference<number>,
  videoState: StateReference<VideoState>,
  connectivityState: StateReference<ConnectivityState>,
  visibilityState: StateReference<boolean>,
}

export interface VideoPlayerAnimations{
  startBlackScreenOpacityAnimation: Animated.Value,
  controllersAnimation: Animated.Value,
  sliderAnimation: Animated.Value,
}

export interface VideoPlayerActions{
  togglePlayPause: ()=>void
}

export default function useVideoPlayerController(homePageController:HomePageController) {

  const videPlayerViewReference = useRef<View>(null);
  const videPlayerReference = useRef<null>(null);

  const startBlackScreenOpacityAnimation = useRef(new Animated.Value(0)).current;
  const controllersAnimation = useRef(new Animated.Value(1)).current;
  const sliderAnimation = useRef(new Animated.Value(0)).current;

  const initState = getStateReference<boolean>(true);
  const pausedState = getStateReference<boolean>(false);
  const durationState = getStateReference<number>(0);
  const currentTimeState = getStateReference<number>(0);
  const currentSeekingState = getStateReference<number|null>(null);



  const currentState = getStateReference<number>(0);
  const videoState = getStateReference<VideoState>(VideoState.onStart);
  const connectivityState = getStateReference<ConnectivityState>(ConnectivityState.internet);
  const visibilityState = getStateReference<boolean>(false);


  const datetime = useRef<Date>(null);

    useTVButtons({
      key: "Video Player",
      condition: ()=>homePageController.isVideoPlaying(),
      actionMap: {
        'left': () => {
          seekPlus(10);
        },
        'right': () => {
          seekPlus(-10);
        },
        'select': () => {
          togglePlayPause();
        }
      },
      onBackButtonPressed: ()=>{
        homePageController.lastPlayedVideo.set(homePageController.videoPlaying.get());
        homePageController.videoPlaying.set(null);
        controller.states.currentTimeState.set(0);
        homePageController.saveLastPlayedVideo(homePageController.videoPlaying.get()!.id, homePageController.lastPlayedVideoSeek.get());
      }
    });


    function togglePlayPause() {
      pausedState.set(!pausedState.get());
    }


    function seekPlus(number: number){
      if(currentSeekingState.get()==null){
        currentSeekingState.set(Math.min(currentTimeState.get() + number, durationState.get()));
      }else{
        currentSeekingState.set(Math.min(currentSeekingState.get()! + number, durationState.get()));
      }
      datetime.current = new Date();
      setTimeout(() => {
        if (new Date().getTime() - datetime.current!.getTime() > 950) {
          const player = videPlayerReference.current as { seek: (time: number | null) => void } | null;
          player!.seek(currentSeekingState.get());
          currentSeekingState.set(null);
        }
      }, 1000);
    }

    useEffect(() => {
        Animated.timing(sliderAnimation, {
          toValue: currentSeekingState.get()??currentTimeState.get(),
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
    }, [currentSeekingState.get(), currentTimeState.get()]);



    



    // Fade in animation when video starts playing
    useEffect(() => {
        if (homePageController.isVideoPlaying()) {
            Animated.timing(startBlackScreenOpacityAnimation, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else {
            startBlackScreenOpacityAnimation.setValue(0);
        }
    }, [homePageController.isVideoPlaying()]);





    useEffect(() => {
        if (homePageController.isVideoPlaying()) {
            const timer = setTimeout(() => {
                visibilityState.set(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [homePageController.isVideoPlaying()]);





    useEffect(() => {
      const interval = setInterval(async () => {
        connectivityState.set(await checkConnectivity());
      }, 2000); // كل 5 ثواني
      return () => clearInterval(interval);
    }, []);

    setTimeout(() => {
      videPlayerViewReference.current?.focus();
    }, 500);



  const controller: VideoPlayerController = {
    videPlayerReference: videPlayerReference,
    animations: {
      startBlackScreenOpacityAnimation,
      sliderAnimation,
      controllersAnimation
    },
    states: {
      initState: initState,
      pausedState: pausedState,
      durationState: durationState,
      currentTimeState: currentTimeState,
      currentSeekingState: currentSeekingState,
      currentState: currentState,
      videoState: videoState,
      connectivityState: connectivityState,
      visibilityState: visibilityState
    },
    actions: {
      togglePlayPause
    }
  };

  return controller;

}




