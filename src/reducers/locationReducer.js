import * as sagaConstants from "../sagas/sagaConstants";


const initialState = {
  prevLocation: {
    latitude: null,
    longitude: null
  },
  currentLocation: {
    latitude: null,
    longitude: null
  },
  updatedAt: null,
  lastUpdateSubmittedAt: null,
  locationRetrievalFailed: false,
  requestPending: false,
  watchId: null
};


export default (state = initialState, action) => {
  switch (action.type) {

    case sagaConstants.LOCATION_GET_REQUEST:
      return state;
    case sagaConstants.LOCATION_GET_REQUEST_FAILED:
      return { ...state, locationRetrievalFailed: true };
    case sagaConstants.LOCATION_GET_REQUEST_SUCCESSFUL:
      return { ...state, locationRetrievalFailed: false,
        prevLocation: state.currentLocation,
        updatedAt: action.payload.updatedAt,
        currentLocation: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude
        }
      };

    case sagaConstants.LOCATION_WATCH_START:
    case sagaConstants.LOCATION_WATCH_START_FAILED:
      return state;
    case sagaConstants.LOCATION_WATCH_START_SUCCESSFUL:
      return { ...state, watchId: action.payload };

    case sagaConstants.LOCATION_WATCH_STOP:
      return state;
    case sagaConstants.LOCATION_WATCH_STOP_FAILED:
    case sagaConstants.LOCATION_WATCH_STOP_SUCCESSFUL:
      return { ...state, watchId: null };

    case sagaConstants.LOCATION_WATCH_UPDATE_FAILED:
      return { ...state, locationRetrievalFailed: true };
    case sagaConstants.LOCATION_WATCH_UPDATE_SUCCESSFUL:
      return { ...state, locationRetrievalFailed: false,
        prevLocation: state.currentLocation,
        updatedAt: action.payload.updatedAt,
        currentLocation: {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude
        }
      };

    case sagaConstants.LOCATION_UPDATE_SUBMIT:
      return { ...state, requestPending: false };
    case sagaConstants.LOCATION_UPDATE_SUBMITTING:
      return { ...state, requestPending: true };
    case sagaConstants.LOCATION_UPDATE_SUBMIT_SUCCESSFUL:
      return { ...state, requestPending: false, lastUpdateSubmittedAt: action.payload };
    case sagaConstants.LOCATION_UPDATE_SUBMIT_FAILED:
      return { ...state, requestPending: false };

    default:
      return state;
  }
};
