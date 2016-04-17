const {take, put, call} = require("redux-saga/effects");
import * as sagaConstants from "./sagaConstants";
import * as networkApi from "../api/networkApi";
import * as appStateApi from "../api/appStateApi";


export function* networkSaga() {
  const {payload: dispatch} = yield take(sagaConstants.APP_START);
  // Initial den Netzwerk-Status abfragen
  const nowOnline = yield call(networkApi.getNetworkStatus);
  if (nowOnline) {
    yield put({ type: sagaConstants.NETWORK_GOES_ONLINE, payload: new Date() });
  } else {
    yield put({ type: sagaConstants.NETWORK_GOES_OFFLINE, payload: new Date() });
  }
  // Listener einrichten
  yield call(doSetupNetworkListener, dispatch);
  // Auf das Beenden der App warten
  yield take(sagaConstants.APP_STOP);
}

function* doSetupNetworkListener(dispatch) {
  yield networkApi.initializeNetworkStatus(
    () => { dispatch({type: sagaConstants.NETWORK_GOES_ONLINE }); },
    () => { dispatch({type: sagaConstants.NETWORK_GOES_OFFLINE }); }
  );
}


export function* appStateSaga() {
  const {payload: dispatch} = yield take(sagaConstants.APP_START);
  // Initial den App-Status abfragen
  const inForeground = yield call(appStateApi.getInForeground);
  if (inForeground) {
    yield put({ type: sagaConstants.APPSTATE_GOES_FRONT });
  } else {
    yield put({ type: sagaConstants.APPSTATE_GOES_BACK });
  }
  // Listener einrichten
  yield call(doSetupAppStateListener, dispatch);
  // Auf das Beenden der App warten
  yield take(sagaConstants.APP_STOP);
}

function* doSetupAppStateListener(dispatch) {
  yield appStateApi.initializeInForeground(
    () => { dispatch({type: sagaConstants.APPSTATE_GOES_FRONT }); },
    () => { dispatch({type: sagaConstants.APPSTATE_GOES_BACK }); }
  );
}
