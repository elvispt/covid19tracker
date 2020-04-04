import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import CountryStats from "./views/CountryStats.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/country-stats",
      name: "CountryStats",
      component: CountryStats,
    },
  ],
});
