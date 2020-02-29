import axios from "axios";
import store from "./store";

export const apiKey = "AIzaSyCw-lZIhvFfrU2Y2GBbZr2kXO1BmVstvHM";
const authUrl = "https://identitytoolkit.googleapis.com/v1";
const databaseUrl = "https://sedcohrid.firebaseio.com/api";
const refreshTokenUrl = "https://securetoken.googleapis.com/v1";

export const axiosAuth = new axios.create({
  baseURL: authUrl
});

export const axiosDatabase = new axios.create({
  baseURL: databaseUrl
});

axiosDatabase.interceptors.response.use(undefined, err => {
  return new Promise(function() {
    if (
      err.response.status === 401 &&
      err.config &&
      !err.config.__isRetryRequest
    ) {
      store.dispatch("logout");
    }
    throw err;
  });
});

export const axiosToken = new axios.create({
  baseURL: refreshTokenUrl
});
