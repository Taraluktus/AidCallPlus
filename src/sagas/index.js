import { networkSaga, appStateSaga } from "./globalSaga";
import { locationSaga, locationSubmitSaga, locationSubmitForceSaga } from "./locationSaga";
import { userSessionSaga, userUpdateSaga, userOptionsSaga } from "./userSaga";
import { socketSaga, socketSubmitSaga } from "./socketSaga";


export default [
  networkSaga, appStateSaga,
  locationSaga, locationSubmitSaga, locationSubmitForceSaga,
  userSessionSaga, userUpdateSaga, userOptionsSaga,
  socketSaga, socketSubmitSaga
];
