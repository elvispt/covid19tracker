<template>
  <div id="home">
    <world-stats></world-stats>

    <hr>

    <country-chart
      title-text="Total Infected Timeline"
      country="pt"
    ></country-chart>
  </div>
</template>

<script>
import WorldStats from '@/components/WorldStats.vue';
import CountryChart from '@/components/CountryChart.vue';

export default {
  name: 'App',
  components: {
    WorldStats,
    CountryChart,
  },
}
</script>
