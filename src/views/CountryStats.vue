<template>
  <div id="country-stats">
    <countries-stats></countries-stats>
  </div>
</template>

<script>
import Vue from 'vue';
import ElementUI from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import VueDataTables from 'vue-data-tables';
import CountriesStats from "@/components/CountriesStats.vue";

Vue.use(ElementUI);
Vue.use(VueDataTables);
locale.use(lang);

export default {
  name: 'CountryStats',
  components: {
    CountriesStats,
  },
}
</script>