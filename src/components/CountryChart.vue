<template>
  <div id="country-chart">
    <line-chart-container
        :title-text="titleText"
        :country="country"
      ></line-chart-container>
  </div>
</template>

<script>
import LineChartContainer from '@/components/LineChartContainer.vue';

export default {
  name: 'CountryChart',
  components: {
    LineChartContainer,
  },

  props: ['titleText', 'country'],
}
</script>