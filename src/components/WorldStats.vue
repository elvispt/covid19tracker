<template>
  <div class="world-stats px-6">
    <h3 class="text-2xl font-bold text-gray-800" v-loading="loading">World Stats</h3>
    <div class="flex items-stretch text-gray-800">
      <div class="flex-1 bg-gray-200">
        Total infected: {{ total | formatNumber }} <small class="text-red-600">(+ {{ newCases | formatNumber }})</small>
        </div>
      <div class="flex-1 bg-gray-200">
        Total Deaths: {{ totalDeaths | formatNumber }} <small class="text-red-600">(+ {{ newTotalDeaths | formatNumber }})</small>
      </div>
      <div class="flex-1 bg-gray-200">Total Recovered: {{ totalRecovered | formatNumber }} <small class="text-red-600">(+ {{ newRecovered | formatNumber }})</small></div>
      <div class="flex-1 bg-gray-200">Death Rate: {{ deathRate | formatPercentage }}</div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral';

export default {
  name: 'WorldStats',

  data() {
    return {
      loading: true,
      total: 0,
      newCases: 0,
      totalDeaths: 0,
      newTotalDeaths: 0,
      totalRecovered: 0,
      newRecovered: 0,
      deathRate: 0,
    };
  },

  created() {
    this.fetchWorldStats();
  },

  methods: {
    fetchWorldStats() {
      fetch('https://api.covid19api.com/summary')
        .then(res => res.json())
        .then(response => {
          let results = response.Global;

          this.total = results.TotalConfirmed;
          this.newCases = results.NewConfirmed;
          this.totalDeaths = results.TotalDeaths;
          this.newTotalDeaths = results.NewDeaths;
          this.totalRecovered = results.TotalRecovered;
          this.newRecovered = results.NewRecovered;
          this.deathRate = (results.TotalDeaths * 100) / results.TotalConfirmed;

          setTimeout(() => { this.loading = false }, 1000);
        })
        .catch(err => console.error(err))
      ;
    }
  },

  filters: {
    formatPercentage(value) {
      if (!value) {
        return '';
      }
      return numeral(value).format('0.00') + '%';
    },
    formatNumber(value) {
      if (!value) {
        return '';
      }
      let formatted = numeral(value).format();
      return formatted.replace(new RegExp(',', 'g'), ' ');
    }
  },
}
</script>
