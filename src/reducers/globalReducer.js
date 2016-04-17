import * as sagaConstants from "../sagas/sagaConstants";


const initialState = {
  dispatch: null,
  connected: true,
  inForeground: true
};


export default (state = initialState, action) => {
  switch (action.type) {

    case sagaConstants.APP_START:
      return { ...state, dispatch: action.payload };
    case sagaConstants.APP_STOP:
      return { ...state, dispatch: null, connected: false };

    case sagaConstants.NETWORK_GOES_ONLINE:
      return { ...state, connected: true };
    case sagaConstants.NETWORK_GOES_OFFLINE:
      return { ...state, connected: false };

    case sagaConstants.APPSTATE_GOES_FRONT:
      return { ...state, inForeground: true };
    case sagaConstants.APPSTATE_GOES_BACK:
      return { ...state, inForeground: false };

    default:
      return state;
  }
};
