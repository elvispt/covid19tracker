import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import CountryStats from "./views/CountryStats.vue";
import CountryCharts from "./views/CountryCharts.vue";

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
    {
      path: "/country-charts/:country",
      name: "CountryCharts",
      component: CountryCharts,
      props: true,
    }
  ],
});
