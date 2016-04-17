import {SERVER_URL, checkStatus, parseJSON} from "./fetchUtils";
const moment = require("moment");

// Nach 150 Sekunden wird eine Pos. als zu alt betrachtet
export const LOCATION_FRESHNESS_IN_MS = 150 * 1000;
// Nach 150 Sekunden wird eine Pos. als zu alt betrachtet (wenn App im Hintergrund läuft)
export const LOCATION_FRESHNESS_BACKGROUND_IN_MS = 300 * 1000;
// Nach 160 Sekunden wird die Nearby-Liste als zu alt betrachtet
export const LOCATION_NEARBY_TIMEOUT_IN_MS = 160 * 1000;
export const MINIMUM_DISTANCE_IN_KM = 5 / 1000;
const geoOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 1000
};





export const getCurrentLocation = (gotLocation, gotError) => {
  navigator.geolocation.getCurrentPosition(
    (location) => {
      gotLocation(location.coords.latitude, location.coords.longitude);
    },
    (error) => {
      gotError(error);
    },
    geoOptions
  );
};

export const initializeLocationWatch = (gotLocation, gotError) => {
  return navigator.geolocation.watchPosition(
    (location) => {
      gotLocation(location.coords.latitude, location.coords.longitude);
    },
    (error) => {
      gotError(error);
    },
    geoOptions
  );
};

export const removeLocationWatch = (watchId) => {
  navigator.geolocation.clearWatch(watchId);
};


export function updateLoc(token, location) {
  return fetch(
    `${SERVER_URL}api/Angels/updateloc?access_token=${token}&lat=${location.latitude}&lng=${location.longitude}`, {
      method: "GET",
      mode: "cors",
      credentials: "include"
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data);
}

export function getNearbyList(token) {
  return fetch(
    `${SERVER_URL}api/Angels/getnearbyangels?access_token=${token}`, {
      method: "GET",
      mode: "cors",
      credentials: "include"
    })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data.users);
}





export function isLocationTooOld(old, inForeground) {
  if (!old) {
    return true;
  }
  const currentDate = moment();
  const oldDate = moment(old);
  let tooOldDate;
  if (inForeground) {
    tooOldDate = currentDate.subtract(LOCATION_FRESHNESS_IN_MS, "milliseconds");
  } else {
    tooOldDate = currentDate.subtract(LOCATION_FRESHNESS_BACKGROUND_IN_MS, "milliseconds");
  }
  return oldDate.isSameOrBefore(tooOldDate);
}

export function haveWeMoved(oldLocation, newLocation) {
  if (!oldLocation || !newLocation) {
    return true;
  }
  let distanceInKm = getDistanceFromLatLngInKm(
    oldLocation.latitude, oldLocation.longitude,
    newLocation.latitude, newLocation.longitude
  );
  return (distanceInKm > MINIMUM_DISTANCE_IN_KM);
}



function getDistanceFromLatLngInKm(lat1, lon1, lat2, lon2) {
  let R = 6371;
  let dLat = deg2rad(lat2 - lat1);
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let d = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
