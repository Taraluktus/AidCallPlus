import {createSelector} from "reselect";

const _getConnected = state => state.global.connected;
const _getInForeground = state => state.global.inForeground;
const _getWatchId = state => state.location.watchId;
const _getDispatch = state => state.global.dispatch;
const _getToken = state => state.user.token;
const _getUserObject = state => state.user.userObject;
const _getCurrentLocation = state => state.location.currentLocation;
const _getLocationUpdatedAt = state => state.location.updatedAt;
const _getPrevLocation = state => state.location.prevLocation;
const _getSocket = state => state.socket.socket;


export const isConnected = createSelector(
  _getConnected,
  (isConnected) => isConnected
);

export const isInForeground = createSelector(
  _getInForeground,
  (isInForeground) => isInForeground
);

export const isConnectedAndInForeground = createSelector(
  isConnected, isInForeground,
  (isConnected, isInForeground) => isConnected && isInForeground
);

export const getWatchId = createSelector(
  _getWatchId,
  (watchId) => watchId
);

export const getDispatch = createSelector(
  _getDispatch,
  (dispatch) => dispatch
);

export const isLoggedIn = createSelector(
  _getToken, _getUserObject,
  (token, userObject) => {
    if (token && userObject)
      return true;
    return false;
  }
);

export const getToken = createSelector(
  _getToken,
  (token) => token
);

export const isConnectedAndLoggedIn = createSelector(
  isConnected, isLoggedIn,
  (connected, loggedIn) => connected && loggedIn
);

export const getPrevLocation = createSelector(
  _getPrevLocation,
  (prevLocation) => prevLocation
);

export const getCurrentLocation = createSelector(
  _getCurrentLocation,
  (currentLocation) => currentLocation
);

export const getCurrentLocationLat = createSelector(
  _getCurrentLocation,
  (location) => location.latitude
);

export const getCurrentLocationLng = createSelector(
  _getCurrentLocation,
  (location) => location.longitude
);

export const getLocationUpdatedAt = createSelector(
  _getLocationUpdatedAt,
  (locationUpdatedAt) => locationUpdatedAt
);

export const getSocket = createSelector(
  _getSocket,
  (socket) => socket
);

export const getUserId = createSelector(
  _getUserObject,
  (userObject) => {
    if (userObject && userObject.id) {
      return userObject.id;
    }
    return null;
  }
);
