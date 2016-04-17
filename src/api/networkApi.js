import {NetInfo} from "react-native";


export const getNetworkStatus = () => {
  return NetInfo.isConnected.fetch().then(isConnected => isConnected);
};

export const initializeNetworkStatus = (goesOnline, goesOffline) => {
  NetInfo.isConnected.addEventListener("change", (isConnected) => {
    if (isConnected) {
      goesOnline();
    } else {
      goesOffline();
    }
  });
};
