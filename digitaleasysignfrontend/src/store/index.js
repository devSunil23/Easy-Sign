import { combineReducers, createStore } from "redux";
import { reducerSignature, viewerAddReducer } from "./reducer";
const rootReducer = combineReducers({
  reducerSignature,
  viewerAddReducer,
});
export const store = createStore(rootReducer);
