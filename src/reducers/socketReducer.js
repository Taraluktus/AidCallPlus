import * as sagaConstants from "../sagas/sagaConstants";


const initialState = {
  requestPending: false,
  lastRequestFailed: false,
  socket: null
};


export default (state = initialState, action) => {
  switch (action.type) {
    case sagaConstants.SOCKET_START_REQUEST:
      return state;
    case sagaConstants.SOCKET_START_REQUESTING:
      return { ...state, requestPending: true, lastRequestFailed: false };
    case sagaConstants.SOCKET_START_REQUEST_SUCCESSFUL:
      return { ...state,
        lastRequestFailed: false, requestPending: false,
        socket: action.payload
      };
    case sagaConstants.SOCKET_START_REQUEST_FAILED:
      return { ...state, lastRequestFailed: true, requestPending: false };

    case sagaConstants.SOCKET_STOP_REQUEST:
      return state;
    case sagaConstants.SOCKET_STOP_REQUESTING:
      return { ...state, requestPending: true, lastRequestFailed: false };
    case sagaConstants.SOCKET_STOP_REQUEST_SUCCESSFUL:
      return { ...state,
        lastRequestFailed: false, requestPending: false,
        socket: null
      };
    case sagaConstants.SOCKET_STOP_REQUEST_FAILED:
      return { ...state, lastRequestFailed: true, requestPending: false };

    case sagaConstants.SOCKET_SUBMIT_USERID:
      return state;
    case sagaConstants.SOCKET_SUBMITTING_USERID:
      return { ...state, requestPending: true, lastRequestFailed: false };
    case sagaConstants.SOCKET_SUBMIT_USERID_SUCCESSFUL:
      return { ...state, lastRequestFailed: false, requestPending: false };
    case sagaConstants.SOCKET_SUBMIT_USERID_FAILED:
      return { ...state, lastRequestFailed: true, requestPending: false };


    default:
      return state;
  }
};
