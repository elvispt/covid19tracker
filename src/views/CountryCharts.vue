<template>
  <div id="country-charts">
    <country-chart
      :country="country"
    ></country-chart>
  </div>
</template>

<script>
import CountryChart from '@/components/CountryChart.vue';

export default {
  name: 'CountryCharts',

  props: {
    country: {
      type: String,
      required: true,
    }
  },

  components: {
    CountryChart
  },
}
</script>