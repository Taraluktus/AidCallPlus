import * as sagaConstants from "../sagas/sagaConstants";

const initialOptionsState = {
  receiveTestAlarms: false,
  remainingTestAlarms: 0,
  centerMapOnMovement: true,
  getLocationInBackground: true,
  keepSceenAlwaysOn: true
};


const initialState = {
  token: null,
  userObject: null,
  requestPending: false,
  lastRequestFailed: false,
  options: initialOptionsState
};


export default (state = initialState, action) => {
  switch (action.type) {

    case sagaConstants.USER_LOGIN_REQUEST:
      return { ...state, requestPending: false, lastRequestFailed: false };
    case sagaConstants.USER_LOGIN_REQUESTING:
      return { ...state, requestPending: true };
    case sagaConstants.USER_LOGIN_REQUEST_SUCCESSFUL:
      return { 
        ...state, requestPending: false, lastRequestFailed: false, token: action.payload.id, userObject: null
      };
    case sagaConstants.USER_LOGIN_REQUEST_FAILED:
      return { ...state, requestPending: false, lastRequestFailed: true, token: null, userObject: null };

    case sagaConstants.USER_LOGOUT_REQUEST:
      return { ...state, requestPending: false, lastRequestFailed: false };
    case sagaConstants.USER_LOGOUT_REQUESTING:
      return { ...state, requestPending: true };
    case sagaConstants.USER_LOGOUT_REQUEST_SUCCESSFUL:
      return {
        ...state, requestPending: false, lastRequestFailed: false, token: null, userObject: null
      };
    case sagaConstants.USER_LOGOUT_REQUEST_FAILED:
      return { ...state, requestPending: false, lastRequestFailed: true };

    case sagaConstants.USER_UPDATE_REQUEST:
      return { ...state, requestPending: false, lastRequestFailed: false };
    case sagaConstants.USER_UPDATE_REQUESTING:
      return { ...state, requestPending: true };
    case sagaConstants.USER_UPDATE_REQUEST_SUCCESSFUL:
      return { ...state, requestPending: false, lastRequestFailed: false, userObject: action.payload };
    case sagaConstants.USER_UPDATE_REQUEST_FAILED:
      return { ...state, requestPending: false, lastRequestFailed: true, userObject: {} };

    case sagaConstants.USER_OPTIONS_LOAD_REQUEST:
      return { ...state, requestPending: false, lastRequestFailed: false };
    case sagaConstants.USER_OPTIONS_LOAD_REQUESTING:
      return { ...state, requestPending: true };
    case sagaConstants.USER_OPTIONS_LOAD_REQUEST_SUCCESSFUL:
      return {
        ...state, requestPending: false, lastRequestFailed: false,
        options: Object.assign({}, state.options, {remainingTestAlarms: action.payload.remainingTestAlarms})
      };
    case sagaConstants.USER_OPTIONS_LOAD_REQUEST_FAILED:
      return { ...state, requestPending: false, lastRequestFailed: true };

    case sagaConstants.USER_OPTIONS_SAVE_REQUEST:
      return { ...state, requestPending: false, lastRequestFailed: false };
    case sagaConstants.USER_OPTIONS_SAVE_REQUESTING:
      return { ...state, requestPending: true };
    case sagaConstants.USER_OPTIONS_SAVE_REQUEST_SUCCESSFUL:
      return { ...state, requestPending: false, lastRequestFailed: true, options: action.payload };
    case sagaConstants.USER_OPTIONS_SAVE_REQUEST_FAILED:
      return { ...state, requestPending: false, lastRequestFailed: true };

    default:
      return state;
  }
};
