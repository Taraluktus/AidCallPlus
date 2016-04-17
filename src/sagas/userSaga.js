const {take, put, call, select} = require("redux-saga/effects");
const {takeLatest} = require("redux-saga");
import * as userApi from "../api/userApi";
import * as sagaConstants from "./sagaConstants";
import * as selectors from "../selectors/";


export function* userSessionSaga() {
  yield take(sagaConstants.APP_START);
  while (true) {
    // Wenn wir nicht online sind, warten bis wir online sind
    const initiallyConnected = yield select(selectors.isConnected);
    if (!initiallyConnected)
      yield take(sagaConstants.NETWORK_GOES_ONLINE);
    // Wir sind online!
    const loginLogoutAction =
      yield take([sagaConstants.USER_LOGIN_REQUEST, sagaConstants.USER_LOGOUT_REQUEST]);
    const nowConnected = yield select(selectors.isConnected);
    if (loginLogoutAction.type === sagaConstants.USER_LOGIN_REQUEST) {
      const {email, password} = loginLogoutAction.payload;
      if (!nowConnected)
        yield take(sagaConstants.NETWORK_GOES_ONLINE);
      yield call(doUserLoginSaga, email, password);
    } else {
      if (!nowConnected)
        yield take(sagaConstants.NETWORK_GOES_ONLINE);
      const tokenForLogout = yield select(selectors.getToken);
      yield call(doUserLogoutSaga, tokenForLogout);
    }
  }
}

export function* userUpdateSaga() {
  yield take(sagaConstants.APP_START);
  yield* takeLatest([
    sagaConstants.NETWORK_GOES_ONLINE, sagaConstants.NETWORK_GOES_OFFLINE,
    sagaConstants.USER_LOGIN_REQUEST_SUCCESSFUL, sagaConstants.USER_LOGIN_REQUEST_FAILED,
    sagaConstants.USER_LOGOUT_REQUEST_SUCCESSFUL, sagaConstants.USER_LOGOUT_REQUEST_FAILED
  ], doUserUpdateSaga);
}


function* doUserUpdateSaga() {
  const tokenToCheck = yield select(selectors.getToken);
  yield put({ type: sagaConstants.USER_UPDATE_REQUEST });
  yield put({ type: sagaConstants.USER_UPDATE_REQUESTING });
  try {
    const userObject = yield call(userApi.update, tokenToCheck);
    yield put({ type: sagaConstants.USER_UPDATE_REQUEST_SUCCESSFUL, payload: userObject });
  } catch (error) {
    yield put({ type: sagaConstants.USER_UPDATE_REQUEST_FAILED, error: error });
  }
}




function* doUserLoginSaga(email, password) {
  yield put({ type: sagaConstants.USER_LOGIN_REQUESTING });
  try {
    const loginResult = yield call(userApi.login, email, password);
    yield put({ type: sagaConstants.USER_LOGIN_REQUEST_SUCCESSFUL, payload: loginResult });
  } catch (error) {
    yield put({ type: sagaConstants.USER_LOGIN_REQUEST_FAILED, error: error });
  }
}

function* doUserLogoutSaga(tokenForLogout) {
  yield put({ type: sagaConstants.USER_LOGOUT_REQUESTING });
  try {
    yield call(userApi.logout, tokenForLogout);
    yield put({ type: sagaConstants.USER_LOGOUT_REQUEST_SUCCESSFUL });
  } catch (error) {
    yield put({ type: sagaConstants.USER_LOGOUT_REQUEST_FAILED });
  }
}





export function* userOptionsSaga() {
  yield take(sagaConstants.APP_START);
  while (true) {
    // Auf diverse Aktionen warten
    const optionsAction = yield take(
      [sagaConstants.USER_UPDATE_REQUEST_SUCCESSFUL, sagaConstants.USER_OPTIONS_LOAD_REQUEST,
        sagaConstants.USER_OPTIONS_SAVE_REQUEST]
    );
    // Wenn wir nicht online sind, warten bis wir online sind
    const connected = yield select(selectors.isConnected);
    if (!connected)
      yield take(sagaConstants.NETWORK_GOES_ONLINE);
    // Wir sind online!
    const loggedIn = yield select(selectors.isLoggedIn);
    if (loggedIn && connected) {
      const tokenToUse = yield select(selectors.getToken);
      if (optionsAction.type === sagaConstants.USER_OPTIONS_SAVE_REQUEST) {
        // Optionen speichern
        yield call(doUserSaveOptionsSaga, tokenToUse, optionsAction.payload);
      } else {
        // Optionen laden
        yield call(doUserLoadOptionsSaga, tokenToUse);
      }
    }
  }
}


function* doUserSaveOptionsSaga(token, options) {
  try {
    yield put({ type: sagaConstants.USER_OPTIONS_SAVE_REQUESTING });
    yield call(userApi.changeReceiveTestAlarms, options.receiveTestAlarms);
    yield put({ type: sagaConstants.USER_OPTIONS_SAVE_REQUEST_SUCCESSFUL, payload: options });
  } catch (error) {
    yield put({ type: sagaConstants.USER_OPTIONS_SAVE_REQUEST_FAILED, error: error });
  }
}

function* doUserLoadOptionsSaga(token) {
    try {
    yield put({ type: sagaConstants.USER_OPTIONS_LOAD_REQUESTING });
    const remaining = yield call(userApi.getRemainingTestAlarms, token);
    yield put({
      type: sagaConstants.USER_OPTIONS_LOAD_REQUEST_SUCCESSFUL,
      payload: {
        remainingTestAlarms: remaining
      }
    });
  } catch (error) {
    yield put({ type: sagaConstants.USER_OPTIONS_LOAD_REQUEST_FAILED, error: error });
  }
}
