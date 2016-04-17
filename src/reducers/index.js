import { combineReducers } from "redux";
import global from "./globalReducer";
import location from "./locationReducer";
import user from "./userReducer";
import socket from "./socketReducer";


const combinedReducer = combineReducers({
  global,
  location,
  user,
  socket
});

export default combinedReducer;
