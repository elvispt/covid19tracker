<template>
  <div class="world-stats px-6">
    <h3 class="text-2xl font-bold text-gray-800">World Stats</h3>
    <div class="flex items-stretch text-gray-800">
      <div class="flex-1 bg-gray-200">
        Total infected: {{ total | formatNumber }} <small class="text-red-600">(+ {{ newCases | formatNumber }})</small>
        </div>
      <div class="flex-1 bg-gray-200">
        Total Deaths: {{ totalDeaths | formatNumber }} <small class="text-red-600">(+ {{ newTotalDeaths | formatNumber }})</small>
      </div>
      <div class="flex-1 bg-gray-200">Total Recovered: {{ totalRecovered | formatNumber }}</div>
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
      total: 0,
      newCases: 0,
      totalDeaths: 0,
      newTotalDeaths: 0,
      totalRecovered: 0,
      deathRate: 0,
    };
  },

  created() {
    this.fetchWorldStats();
  },

  methods: {
    fetchWorldStats() {
      fetch('https://api.thevirustracker.com/free-api?global=stats')
        .then(res => res.json())
        .then(response => {
          let results = response.results[0];

          this.total = results.total_cases;
          this.newCases = results.total_new_cases_today;
          this.totalDeaths = results.total_deaths;
          this.newTotalDeaths = results.total_new_deaths_today;
          this.totalRecovered = results.total_recovered;
          this.deathRate = (results.total_deaths * 100) / results.total_cases;
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
