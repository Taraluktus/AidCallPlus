import {AppState} from "react-native";


export const getInForeground = () => {
  if (AppState.currentState === "active") {
    return true;
  }
  return false;
};

export const initializeInForeground = (goesToFront, goesToBack) => {
  AppState.addEventListener("change", () => {
    if (getInForeground()) {
      goesToFront();
    } else {
      goesToBack();
    }
  });
};
