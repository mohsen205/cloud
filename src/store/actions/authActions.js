import { createAsyncThunk } from "@reduxjs/toolkit";
import constant from "../../../constant";
import axios from "axios";

const { httpsEndpoint, localStorageKeys } = constant;

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ adminEmail, adminPassword }) => {
    const response = await axios.post(`${httpsEndpoint}/auth/admin-login`, {
      email: adminEmail,
      password: adminPassword,
    });

    const {
      uid,
      email,
      displayName,
      idToken,
      refreshToken,
      expiresIn,
      photoUrl,
      firstName,
      lastName,
    } = response.data;

    localStorage.setItem(
      localStorageKeys.user,
      JSON.stringify({
        uid,
        email,
        displayName,
        photoUrl,
        firstName,
        lastName,
      }),
    );

    localStorage.setItem("id-token", idToken);
    localStorage.setItem("refresh-token", refreshToken);
    localStorage.setItem("expires-in", expiresIn);

    axios.defaults.headers.common.Authorization = `Bearer ${idToken}`;

    return response.data;
  },
);
