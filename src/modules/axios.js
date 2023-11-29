import axios from "axios";

// modules
import { decryptData } from "@/modules/encryption";

const { accessToken } = JSON.parse(
  decryptData(sessionStorage.getItem("userData"))
);

export const axiosClient = axios.create({
  baseURL: `https://backend.observer.xyz`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
});

export const axiosBasicAuth = axios.create({
  baseURL:
    import.meta.env.VITE_APP_ENVIRONMENT === "dev"
      ? "/api"
      : "https://geotune.observer.xyz",
  headers: {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  params: {
    X_API_KEY: import.meta.env.VITE_APP_X_API_KEY,
  },
  auth: {
    username: import.meta.env.VITE_APP_USERNAME,
    password: import.meta.env.VITE_APP_PASSWORD,
  },
});
