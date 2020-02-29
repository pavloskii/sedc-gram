import store from "../store";

export default (to, from, next) => {
  console.log(store.getters.isUserAuthenticated);
  if (store.getters.isUserAuthenticated) {
    next();
  } else {
    next("/login");
  }
};
