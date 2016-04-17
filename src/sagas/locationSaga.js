const {takeLatest} = require("redux-saga");
const {fork, call, take, put, race, cancel, select} = require("redux-saga/effects");
import * as sagaConstants from "./sagaConstants";
import * as locationApi from "../api/locationApi";
import * as selectors from "../selectors/";
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


export function* locationSaga() {
  // Auf den App-Start warten
  const {payload: dispatch} = yield take(sagaConstants.APP_START);

  // Den Standort initial abfragen, und zwar solange, bis wir wirklich einen haben
  let getAction;
  do {
    yield call(doSetupLocationGet, dispatch);
    // Auf Ergebnis warten
    getAction =
      yield take([sagaConstants.LOCATION_GET_REQUEST_FAILED, sagaConstants.LOCATION_GET_REQUEST_SUCCESSFUL]);
    // Wenn es fehlgeschlagen ist, 5 Sekunden warten
    if (getAction.type === sagaConstants.LOCATION_GET_REQUEST_FAILED)
      yield call(delay, 5000);
    // Die Schleife wiederholen, wenn GPS fehlgeschlagen ist
  } while (getAction && getAction.type === sagaConstants.LOCATION_GET_REQUEST_FAILED);

  // GPS ist aktiv, nun können wir die Watch einrichten
  yield call(doSetupLocationWatch, dispatch);
  // Nun checken wir auf GPS-Ausfälle
  while (true) {
    // GPS fehlgeschlagen
    yield take(sagaConstants.LOCATION_WATCH_UPDATE_FAILED);
    // Watch stoppen
    const watchId = yield select(selectors.getWatchId);
    yield call(doRemoveLocationWatch, watchId);
    // Solange manuell abfragen, bis wir wieder GPS haben
    do {
      yield call(doSetupLocationGet, dispatch);
      // Auf Ergebnis warten
      getAction =
        yield take([sagaConstants.LOCATION_GET_REQUEST_FAILED, sagaConstants.LOCATION_GET_REQUEST_SUCCESSFUL]);
      // Wenn es fehlgeschlagen ist, 5 Sekunden warten
      if (getAction.type === sagaConstants.LOCATION_GET_REQUEST_FAILED)
        yield call(delay, 5000);
      // Die Schleife wiederholen, wenn GPS fehlgeschlagen ist
    } while (getAction && getAction.type === sagaConstants.LOCATION_GET_REQUEST_FAILED);
    // GPS ist wieder aktiv, nun Watch einrichten
    yield call(doSetupLocationWatch, dispatch);
  }
}

function* doSetupLocationWatch(dispatch) {
  yield put({ type: sagaConstants.LOCATION_WATCH_START });
  const watchId = locationApi.initializeLocationWatch(
    (lat, lng) =>
      dispatch({
        type: sagaConstants.LOCATION_WATCH_UPDATE_SUCCESSFUL, payload: {
          latitude: lat, longitude: lng, updatedAt: new Date()
        }
      })
    , (error) => dispatch({ type: sagaConstants.LOCATION_WATCH_UPDATE_FAILED, error: error })
  );
  yield put({ type: sagaConstants.LOCATION_WATCH_START_SUCCESSFUL, payload: watchId });
}

function* doSetupLocationGet(dispatch) {
  yield put({ type: sagaConstants.LOCATION_GET_REQUEST });
  yield locationApi.getCurrentLocation(
    (lat, lng) => {
      dispatch({
        type: sagaConstants.LOCATION_GET_REQUEST_SUCCESSFUL, payload: {
          latitude: lat, longitude: lng, updatedAt: new Date()
        }
      });
    },
    (error) => {
      dispatch({ type: sagaConstants.LOCATION_GET_REQUEST_FAILED, error: error });
    }
  );
}

function* doRemoveLocationWatch(watchId) {
  yield put({ type: sagaConstants.LOCATION_WATCH_STOP });
  yield call(locationApi.removeLocationWatch, watchId);
  // 5 Sekunden warten
  yield call(delay, 5000);
  yield put({ type: sagaConstants.LOCATION_WATCH_STOP_SUCCESSFUL });
}













export function* locationSubmitSaga() {
  yield take(sagaConstants.APP_START);
  yield call(delay, 5000);
  yield* takeLatest(
    [sagaConstants.LOCATION_GET_REQUEST_SUCCESSFUL,
      sagaConstants.LOCATION_WATCH_UPDATE_SUCCESSFUL, sagaConstants.APPSTATE_GOES_FRONT,
      sagaConstants.NETWORK_GOES_ONLINE],
    locationCheckForSubmitSaga
  );
}

export function* locationSubmitForceSaga() {
  yield take(sagaConstants.APP_START);
  yield call(delay, 5000);
  while (true) {
    const inForeground = yield select(selectors.isInForeground);
    const updatedAt = yield select(selectors.getLocationUpdatedAt);
    if (locationApi.isLocationTooOld(updatedAt, inForeground)) {
      // Okay, wir müssen ein Update an den Server schicken, falls wir eingeloggt und online sind
      const loggedInAndOnline = yield select(selectors.isConnectedAndLoggedIn);
      if (loggedInAndOnline) {
        const tokenToUse = yield select(selectors.getToken);
        const locToUse = yield select(selectors.getCurrentLocation);
        yield fork(doSubmitNewLocation, tokenToUse, locToUse);
      }
    }
    // Timer für erwzungene Updates anhand App-State festlegen
    if (inForeground) {
      yield call(delay, locationApi.LOCATION_FRESHNESS_IN_MS);
    } else {
      yield call(delay, locationApi.LOCATION_FRESHNESS_BACKGROUND_IN_MS);
    }
  }
}



function* locationCheckForSubmitSaga(action) {
  // Nur durchführen, wenn wir eingeloggt sind
  const loggedInAndOnline = yield select(selectors.isConnectedAndLoggedIn);
  if (loggedInAndOnline) {
    try {
      // Die alte Position
      const lastLocation = yield select(selectors.getPrevLocation);
      // Die neue Position
      let newLocation;
      if (action.type === sagaConstants.APPSTATE_GOES_FRONT || action.type === sagaConstants.NETWORK_GOES_ONLINE) {
        newLocation = yield select(selectors.getCurrentLocation);
      } else {
        // Schon mal Unterscheidung zwischen nativem Geolocation und BGGeolocation
        /* newLocation =
          action.payload.position.coords ? action.payload.position.coords : action.payload.position; */
        newLocation = action.payload;
      }
      // Haben wir uns bewegt?
      if (locationApi.haveWeMoved(lastLocation, newLocation)) {
        // Ja, wir haben uns weit genug bewegt!
        // Dann müssen wir das dem Server übermitteln
        const tokenToUse = yield select(selectors.getToken);
        yield fork(doSubmitNewLocation, tokenToUse, newLocation);
      }
    } catch (error) {
      console.log("locationCheckForSubmitSaga vorzeitig abgebrochen", error);
    }
  }
}


function* doSubmitNewLocation(token, location) {
  try {
    yield put({ type: sagaConstants.LOCATION_UPDATE_SUBMITTING });
    yield call(locationApi.updateLoc, token, location);
    yield put({ type: sagaConstants.LOCATION_UPDATE_SUBMIT_SUCCESSFUL, payload: new Date() });
  } catch (error) {
    yield put({ type: sagaConstants.LOCATION_UPDATE_SUBMIT_FAILED, error: error });
  }
}








