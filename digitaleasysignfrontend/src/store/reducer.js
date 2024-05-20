import {
  ADD_VIEWER_EMAIL,
  SIGNATURE_DATA_URL,
  SIGNATURE_ID,
  SIGNATURE_TEXT,
  SIGNATURE_TEXT_TYPE,
} from "./actionType";

const initialState = {
  signatureText: "",
  signatureTextType: "female",
  signatureId: "",
  signatureDataUrl: undefined,
};
const viewerInitialState = {
  viewerEmails: [],
};
export const reducerSignature = (state = initialState, action) => {
  switch (action.type) {
    case SIGNATURE_TEXT:
      return {
        ...state,
        signatureText: action.payload,
      };

    case SIGNATURE_TEXT_TYPE:
      return {
        ...state,
        signatureTextType: action.payload,
      };
    case SIGNATURE_ID:
      return {
        ...state,
        signatureId: action.payload,
      };
    case SIGNATURE_DATA_URL:
      return {
        ...state,
        signatureDataUrl: action.payload,
      };
    default:
      return state;
  }
};

export const viewerAddReducer = (state = viewerInitialState, action) => {
  switch (action.type) {
    case ADD_VIEWER_EMAIL:
      return {
        ...state,
        viewerEmails: action.payload,
      };
    default:
      return state;
  }
};
