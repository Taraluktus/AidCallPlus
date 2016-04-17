const {fork, call, select, take, put} = require("redux-saga/effects");
import * as sagaConstants from "./sagaConstants";
import * as selectors from "../selectors/";
import * as socketApi from "../api/socketApi";


export function* socketSaga() {
  const {payload: dispatch} = yield take(sagaConstants.APP_START);
  while (true) {
    const socketStartStopAction =
      yield take([sagaConstants.USER_UPDATE_REQUEST_SUCCESSFUL, sagaConstants.USER_UPDATE_REQUEST_FAILED]);
    if (socketStartStopAction.type === sagaConstants.USER_UPDATE_REQUEST_SUCCESSFUL) {
      // Socket einrichten
      yield fork(doSocketSetup);
      // Auf erfolgreiches Einrichten warten
      const socketSetupAction = yield take([sagaConstants.SOCKET_START_REQUEST_SUCCESSFUL,
        sagaConstants.SOCKET_START_REQUEST_FAILED]);
      if (socketSetupAction.type === sagaConstants.SOCKET_START_REQUEST_SUCCESSFUL) {
        // Socket erfolgreich verbunden, nun Listener einrichten
        const socket = socketSetupAction.payload;
        yield call(doSocketListeners, socket, dispatch);
      }
    } else {
      // Socket stoppen, falls wir einen haben
      const existingSocket = yield select(selectors.getSocket);
      if (existingSocket)
        yield fork(doSocketDisconnect, existingSocket);
    }
  }
}

function* doSocketSetup() {
  try {
    yield put({ type: sagaConstants.SOCKET_START_REQUESTING });
    let socket = socketApi.createSocket();
    yield put({ type: sagaConstants.SOCKET_START_REQUEST_SUCCESSFUL, payload: socket });
  } catch (error) {
    yield put({ type: sagaConstants.SOCKET_START_REQUEST_FAILED });
  }
}

function* doSocketListeners(socket, dispatch) {
  yield socketApi.onSocket(socket,
    () => { dispatch({ type: sagaConstants.LOCATION_NEARBY_REQUEST }); },
    () => { dispatch({ type: sagaConstants.SOCKET_SUBMIT_USERID }); },
    () => { dispatch({ type: sagaConstants.SOCKET_STOP_REQUEST }); }
  );
}

function* doSocketDisconnect(socket) {
  try {
    yield put({ type: sagaConstants.SOCKET_STOP_REQUESTING });
    socketApi.disconnect(socket);
    yield put({ type: sagaConstants.SOCKET_STOP_REQUEST_SUCCESSFUL });
  } catch (error) {
    yield put({ type: sagaConstants.SOCKET_STOP_REQUEST_FAILED, error: error });
  }
}







export function* socketSubmitSaga() {
  yield take(sagaConstants.APP_START);
  while (true) {
    yield take(sagaConstants.SOCKET_SUBMIT_USERID);
    // Nur, wenn wir eingeloggt sind!
    const loggedIn = yield select(selectors.isConnectedAndLoggedIn);
    if (loggedIn) {
      // ID des Users ermitteln
      const id = yield select(selectors.getUserId);
      const socket = yield select(selectors.getSocket);
      yield fork(doSocketSubmit, socket, id);
    }
  }
}

function* doSocketSubmit(socket, id) {
  try {
    yield call(socketApi.submitUserId, socket, id);
    yield put({ type: sagaConstants.SOCKET_SUBMIT_USERID_SUCCESSFUL });
  } catch (error) {
    yield put({ type: sagaConstants.SOCKET_SUBMIT_USERID_FAILED, error: error });
  }
}
