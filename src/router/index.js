import Vue from "vue";
import VueRouter from "vue-router";
import NavGuard from "./nav-guard";
import Home from "@/views/Home";
import Login from "@/views/Login";
import Signup from "@/views/Signup";
import Search from "@/views/Search";
import AddPost from "@/views/AddPost";
import Activity from "@/views/Activity";
import Profile from "@/views/Profile";
import DiscoverPeople from "@/views/DiscoverPeople";
import SinglePostView from "@/views/SinglePostView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: NavGuard
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
    beforeEnter: NavGuard
  },
  {
    path: "/add-post",
    name: "AddPost",
    component: AddPost,
    beforeEnter: NavGuard
  },
  {
    path: "/activity",
    name: "Activity",
    component: Activity,
    beforeEnter: NavGuard
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: NavGuard
  },
  {
    path: "/discover-people",
    name: "DiscoverPeople",
    component: DiscoverPeople,
    beforeEnter: NavGuard
  },
  {
    path: "/post/:id",
    name: "SinglePostView",
    component: SinglePostView,
    beforeEnter: NavGuard
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
