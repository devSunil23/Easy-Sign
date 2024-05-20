import {
  ADD_VIEWER_EMAIL,
  SIGNATURE_DATA_URL,
  SIGNATURE_ID,
  SIGNATURE_TEXT,
  SIGNATURE_TEXT_TYPE,
} from "./actionType";

export const selectSignatureText = (data) => {
  return {
    type: SIGNATURE_TEXT,
    payload: data,
  };
};
export const selectSignatureTextType = (data) => {
  return {
    type: SIGNATURE_TEXT_TYPE,
    payload: data,
  };
};
export const selectSignatureiD = (data) => {
  return {
    type: SIGNATURE_ID,
    payload: data,
  };
};
export const selectsignatureDataurl = (data) => {
  return {
    type: SIGNATURE_DATA_URL,
    payload: data,
  };
};
export const addViewerEmail = (data) => {
  return {
    type: ADD_VIEWER_EMAIL,
    payload: data,
  };
};
