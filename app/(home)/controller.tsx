import { getStateReference, StateReference } from "@/helpers/stateReference";
import { loadData, saveData } from "@/helpers/storage";
import { useTVButtons } from "@/helpers/tvButtons";
import { VideoModel } from "@/models/video";
import { useEffect, useRef } from "react";
import { BackHandler, findNodeHandle, View } from "react-native";
import { mockVideos } from '../../data/movies';


export interface HomePageController{
  // States
  mockVideos: VideoModel[],
  currentIndex: StateReference<number>,
  videoPlaying: StateReference<VideoModel | null>,
  lastPlayedVideo: StateReference<VideoModel | null>,
  onLastPlayedVideo: StateReference<boolean>,
  lastPlayedVideoSeek: StateReference<number>,
  //
  isVideoPlaying: ()=>boolean,
  // Save New Last Viewed Video
  saveLastPlayedVideo: (videoId: string, seek: number) => Promise<void>,
}

export default function useHomePageController() {

  const currentIndex = getStateReference<number>(0);
  const videoPlaying = getStateReference<VideoModel | null>(null);
  const isVideoPlaying = ()=>videoPlaying.get()!=null;
  const lastPlayedVideo = getStateReference<VideoModel | null>(null);
  const onLastPlayedVideo = getStateReference<boolean>(false);
  const lastPlayedVideoSeek = getStateReference<number>(0);


  

  // Home Screen Buttons:
  useTVButtons({
    key: 'HOME SCREEN',
    condition: ()=>{
      return !isVideoPlaying();
    },
    // onForwardPressed: () => {
    //   currentIndex.set((currentIndex.get() + 1) % videos.length);
    //   onLastPlayedVideo.set(false);
    // },
    // onBackwardPressed: () => {
    //   currentIndex.set((currentIndex.get() - 1 + videos.length) % videos.length);
    //   onLastPlayedVideo.set(false);
    // },
    onBackButtonPressed: ()=>{
      BackHandler.exitApp();
    },
    actionMap: {
      'up': ()=>{
        if(lastPlayedVideo.get()!=null){
          onLastPlayedVideo.set(true);
        }
      },
      'down': ()=>{
        if(lastPlayedVideo.get()!=null){
          onLastPlayedVideo.set(false);
        }
      },
      'left': ()=>{
        currentIndex.set((currentIndex.get() + 1) % mockVideos.length);
        onLastPlayedVideo.set(false);
      },
      'right': ()=>{
        currentIndex.set((currentIndex.get() - 1 + mockVideos.length) % mockVideos.length);
        onLastPlayedVideo.set(false);
      },
      'select':()=>{
        if(onLastPlayedVideo.get()){
          videoPlaying.set(lastPlayedVideo.get()!);
        }else{
          videoPlaying.set(mockVideos[currentIndex.get()]);
        }
      }
    }
  });


  const mainScreenViewRef = useRef<View>(null);
  const playerViewRef = useRef<any>(null);

  const updaeFocus = (value:Boolean) => {
    const node1 = findNodeHandle(mainScreenViewRef.current);
    if (node1) {
      console.log("Main View Focus 1: ",!value);
      mainScreenViewRef.current?.setNativeProps({ hasTVPreferredFocus: !value , focusable: !value});
    }
    const node2 = findNodeHandle(playerViewRef.current);
    if (node2) {
      console.log("Main View Focus 2: ",value);
      playerViewRef.current?.setNativeProps({ hasTVPreferredFocus: value , focusable: value});
    }
  };




  useEffect(() => {
    const loadLastPlayedVideo = async () => {
      const id = await loadData('last-video-id');
      const seek = await loadData('last-video-seek');
      if(id!=null){
        // Find the video with the loaded id and set it as the current video
        const videoIndex = mockVideos.findIndex(video => video.id === id);
        if (videoIndex !== -1) {
          lastPlayedVideo.set(mockVideos[videoIndex]);
          lastPlayedVideoSeek.set(seek !== null ? Number(seek) : 0);
        }
      }
    };
    loadLastPlayedVideo();
  }, []);
  
  const saveLastPlayedVideo = async (videoId: string, seek: number) => {
    await saveData('last-video-id', videoId);
    await saveData('last-video-seek', seek.toString());
  };



  const controllerReference:HomePageController = {
    mockVideos,
    currentIndex,
    videoPlaying,
    isVideoPlaying,
    lastPlayedVideo,
    onLastPlayedVideo,
    lastPlayedVideoSeek,
    saveLastPlayedVideo
  };



  return {
    states: controllerReference,
    mainScreenViewRef,
    playerViewRef,
  };

}




