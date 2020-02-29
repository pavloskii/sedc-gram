import { axiosAuth, apiKey, axiosToken } from "../../axiosConfig";
import router from "../../router";
import jwtDecode from "jwt-decode";

export default {
  state: {
    loggedUser: null
  },
  getters: {
    isUserAuthenticated(state) {
      return state.loggedUser !== null;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.loggedUser = payload;
    }
  },
  actions: {
    login({ commit }, payload) {
      axiosAuth
        .post("/accounts:signInWithPassword?key=" + apiKey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
        .then(response => {
          const expiresInMs =
            Number.parseInt(response.data.expiresIn, 10) * 1000;
          // const expiresAtDate = new Date(new Date().getTime() + expiresInMs);
          const expiresAtDate = new Date().getTime() + expiresInMs;

          localStorage.setItem("token", response.data.idToken);
          localStorage.setItem("expiresAt", expiresAtDate);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          commit("setUser", {
            email: response.data.email,
            token: response.data.idToken,
            refreshToken: response.data.refreshToken,
            userId: response.data.localId
          });

          router.replace("/");
        })
        .catch(error => commit("setError", error.response.data.error.message));
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      commit("setUser", null);
      router.replace("/login");
    },
    signup({ commit }, payload) {
      axiosAuth
        .post("/accounts:signUp?key=" + apiKey, {
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
        .then(response => {
          const expiresInMs =
            Number.parseInt(response.data.expiresIn, 10) * 1000;
          // const expiresAtDate = new Date(new Date().getTime() + expiresInMs);
          const expiresAtDate = new Date().getTime() + expiresInMs;

          localStorage.setItem("token", response.data.idToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("expiresAt", expiresAtDate);

          commit("setUser", {
            email: response.data.email,
            token: response.data.idToken,
            refreshToken: response.data.refreshToken,
            userId: response.data.localId
          });

          router.replace("/");
        })
        .catch(error => {
          commit("setError", error.response.data.error.message);
        });
    },
    autoLogin({ commit }) {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const expiresAt = localStorage.getItem("expiresAt");
      if (expiresAt <= new Date().getTime()) {
        return;
      }

      try {
        const decoded = jwtDecode(token);

        commit("setUser", {
          email: decoded.email,
          token: token,
          userId: decoded["user_id"]
        });
      } catch (err) {
        console.log(err);
      }
    },
    deleteAccount({ commit, state }) {
      axiosAuth
        .post("/accounts:delete?key=" + apiKey, {
          idToken: state.loggedUser.userId
        })
        .then(response => {
          console.log(response);
        })
        .catch(error => commit("setError", error.response.data.error.message));
    },
    updateAccount({ commit, state }, payload) {
      axiosAuth
        .post("/accounts:update?key=" + apiKey, {
          idToken: state.loggedUser.userId,
          displayName: !payload.username
            ? state.loggedUser.displayName
            : payload.displayName,
          photoUrl: !payload.image ? state.loggedUser.image : payload.image
        })
        .then(response => {
          const expiresAtDate =
            new Date().getTime() + Number(response.data.expiresIn) * 1000;

          localStorage.setItem("token", response.data.idToken);
          localStorage.setItem("expiresAt", expiresAtDate);

          commit("setUser", {
            email: response.data.email,
            token: response.data.idToken,
            userId: response.data.localId,
            username: response.data.displayName,
            image: response.data.photoUrl
          });
        })
        .catch(error => commit("setError", error.response.data.error.message));
    }
  }
};
