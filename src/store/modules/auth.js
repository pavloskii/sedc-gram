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
            userId: response.data.localId,
            username: response.data.displayName,
            image: response.data.profilePicture
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
            userId: response.data.localId,
            username: response.data.displayName,
            image: response.data.profilePicture
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
          userId: decoded["user_id"],
          username: decoded.name,
          image: decoded.picture
        });
      } catch (err) {
        console.log(err);
      }
    },
    deleteAccount({ commit, state, dispatch }) {
      axiosAuth
        .post("/accounts:delete?key=" + apiKey, {
          idToken: state.loggedUser.token
        })
        .then(() => {
          dispatch("logout");
        })
        .catch(error => commit("setError", error.response.data.error.message));
    },
    updateAccount({ commit, state }, { username, image }) {
      axiosAuth
        .post("/accounts:update?key=" + apiKey, {
          idToken: state.loggedUser.token,
          displayName: !username ? state.loggedUser.displayName : username,
          photoUrl: !image ? state.loggedUser.image : image
        })
        .then(response => {
          commit("setUser", {
            email: response.data.email,
            userId: response.data.localId,
            username: response.data.displayName,
            image: response.data.photoUrl
          });

          router.replace("/profile");
        })
        .catch(error => commit("setError", error.response.data.error.message));
    }
  }
};
