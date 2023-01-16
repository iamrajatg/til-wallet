import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { generateDid, generateDidStart } from "./walletSlice";

export const commonSlice = createSlice({
  name: "common",
  initialState: {
    isLoading: false,
    isError: false,
  },
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.isError = action.error;
    },
  }
});

export const { setLoader, setError } = commonSlice.actions;
export default commonSlice.reducer;
