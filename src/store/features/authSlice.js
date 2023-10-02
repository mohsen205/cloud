import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../actions/authActions";
import constant from "../../../constant";

const { localStorageKeys } = constant;

const initialState = {
  loading: false,
  uid: "",
  email: "",
  displayName: "",
  photoURL: "",
  firstName: "",
  lastName: "",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.loading = false;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.error = null;
    },

    logout: state => {
      state.loading = false;
      state.uid = "";
      state.email = "";
      state.displayName = "";
      state.photoUrl = "";
      state.firstName = "";
      state.lastName = "";
      state.error = null;

      localStorage.removeItem(localStorageKeys.user);
      localStorage.removeItem("id-token");
      localStorage.removeItem("refresh-token");
      localStorage.removeItem("expires-in");
    },
  },
  extraReducers: builder => {
    builder.addCase(loginAdmin.pending, state => {
      state.loading = true;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.error = null;
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.uid = "";
      state.email = "";
      state.displayName = "";
      state.photoURL = "";
      state.firstName = "";
      state.lastName = "";
      state.error = action.payload;
    });
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;
