import NetInfo from "@react-native-community/netinfo";

export async function checkConnectivity(): Promise<ConnectivityState> {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return ConnectivityState.noConnection;
    }
    if (!state.isInternetReachable) {
      return ConnectivityState.noInternet;
    }
    return ConnectivityState.internet;
  } catch (e) {
    return ConnectivityState.noConnection;
  }
}



  export enum ConnectivityState {
    internet = 'internet',
    noInternet = 'noInternet',
    noConnection = 'noConnection',
  }
  