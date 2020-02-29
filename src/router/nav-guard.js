import store from "../store";

export default (to, from, next) => {
  if (store.getters.isUserAuthenticated) {
    next();
  } else {
    next("/login");
  }
};
