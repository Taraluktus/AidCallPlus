import R from "ramda";

import {createStore, applyMiddleware, compose} from "redux";

const storage = require("redux-storage");
const createEngine = require("redux-storage-engine-reactnativeasyncstorage").default;
const filter = require("redux-storage-decorator-filter").default;
const debounce = require("redux-storage-decorator-debounce").default;

const createSagaMiddleware = require("redux-saga").default;

const createLogger = require("redux-logger");

import devTools from "remote-redux-devtools";

import sagas from "../sagas/";

import combinedReducer from "../reducers/";
const reducer = storage.reducer(combinedReducer);




let engine = createEngine("aidcallpro-r2");
engine = filter(engine, [
    "user", "location"
], [
    "global", "socket"
]);
engine = debounce(engine, 2000);
const storageMiddleware = storage.createMiddleware(engine);

const sagaMiddleWare = createSagaMiddleware(
  ...sagas
);

// silence these saga-based messages
const SAGA_LOGGING_BLACKLIST = ["EFFECT_TRIGGERED", "EFFECT_RESOLVED", "EFFECT_REJECTED",
  "persist/REHYDRATE", "REDUX_STORAGE_LOAD", "REDUX_STORAGE_SAVE"];
const logger = createLogger({
  duration: true, timestamp: false,
  predicate: (getState, { type }) => R.not(R.contains(type, SAGA_LOGGING_BLACKLIST))
});

const createStoreWithMiddleware = compose(
  applyMiddleware(sagaMiddleWare),
  applyMiddleware(storageMiddleware),
  applyMiddleware(logger),
  devTools()
)(createStore);

const store = createStoreWithMiddleware(reducer);

const load = storage.createLoader(engine);
load(store)
    .then((newState) => console.log("State geladen:", newState))
    .catch(() => console.log("Konnte den vorherigen State nicht laden"));


if (module.hot) {
  module.hot.accept(() => {
    const nextRootReducer = require("../reducers/index").default;
    store.replaceReducer(nextRootReducer);
  });
}


export default () => {
  return store;
};
