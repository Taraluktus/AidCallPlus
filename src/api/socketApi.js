import {SERVER_URL} from "./fetchUtils";
import io from "socket.io-client/socket.io";


export function createSocket() {
  return io(SERVER_URL, {jsonp: false, transports: ["websocket"]});
}

export function onSocket(socket, onNearby, onUserId, onDisconnect) {
  socket.on("shownearbyusers", onNearby);
  socket.on("senduserid", onUserId);
  socket.on("disconnect", onDisconnect);
}

export function disconnect(socket) {
  socket.disconnect();
}

export function submitUserId(socket, userId) {
  socket.emit("userid", {
    userId: userId
  });
}
