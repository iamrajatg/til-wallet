import { createSlice } from "@reduxjs/toolkit";

export const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    dids: [],
    credentials: [],
    isLoading: false,
    isError: false,
    snackMsg: "",
  },
  reducers: {
    generateDid: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    loadCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    loadDids: (state, action) => {
      state.dids = action.payload;
    },
    addCredential: (state) => {
      state.isLoading = true;
      state.isError = false;
      state.snackMsg = "Credential Added Successfully!"
    },
    addCredentialSuccess: (state, action) => {
      state.credentials = [...state.credentials, action.payload];
      state.isLoading = false;
      state.isError = false;
    },
    addCredentialFail: (state, action) => {
      if(action.payload==="ALREADY_STORED")
      state.snackMsg="Credential Already Added."
      state.isLoading = false;
      state.isError = true;
    },
    generateDidSuccess: (state, action) => {
      state.dids = [...state.dids, action.payload];
      state.isLoading = false;
      state.isError = false;
    },
    generateDidFail: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },
    removeDid: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    removeDidSuccess: (state, action) => {
      if (action.payload>=0) state.dids.splice(action.payload);
      state.isLoading = false;
      state.isError = false;
      state.snackMsg = "DID removed successfully!";
    },
    removeDidFail: (state, action) => {
      state.isError = true;
      state.isLoading = false;
    },
    removeCredential: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    removeCredentialSuccess: (state, action) => {
      if (action.payload>=0) state.credentials.splice(action.payload);
      state.isLoading = false;
      state.isError = false;
      state.snackMsg = "Credential Removed Successfully!";
    },
    removeCredentialFail: (state, action) => {
      state.isError = true;
      state.isLoading = false;
      state.snackMsg = "Error Removing Credential.";
    },
    setSnackMsg: (state, action) => {
      state.snackMsg = action.payload;
    },
  },
});

export const {
  loadDids,
  generateDid,
  generateDidSuccess,
  generateDidFail,
  loadCredentials,
  addCredential,
  removeDid,
  removeDidSuccess,
  removeDidFail,
  setSnackMsg,
  removeCredentialSuccess,
  removeCredentialFail,
  removeCredential,
  addCredentialSuccess,
  addCredentialFail
} = walletSlice.actions;
export default walletSlice.reducer;
