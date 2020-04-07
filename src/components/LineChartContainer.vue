<template>
  <div id="line-chart-container">
    <h3 class="px-6 text-2xl font-bold text-gray-800" v-loading="loading">Graphs</h3>
    <h4 class="text-center px-6 text-xl font-bold text-gray-800">{{ countryName }}</h4>

    <hr class="my-3" />

    <el-alert
      v-if="alert.show"
      :title="alert.title"
      :description="alert.description"
      :show-icon="alert.showIcon"
      :closable="alert.closable"
      type="error">
    </el-alert>

    <chart
      v-if="loadedTotals"
      :chart-data="chartDataTotalInfected"
      :options="optionsTotalInfected"
      class="w-2/4 inline-block"
      />

    <chart
      v-if="loadedNew"
      :chart-data="chartDataNewInfected"
      :options="optionsNewInfected"
      class="w-2/4 inline-block"
      />

      <hr class="my-3">

      <chart
      v-if="loadedTotals"
      :chart-data="chartDataTotalDeaths"
      :options="optionsTotalDeaths"
      class="w-2/4 inline-block"
      />

    <chart
      v-if="loadedNew"
      :chart-data="chartDataNewDeaths"
      :options="optionsNewDeaths"
      class="w-2/4 inline-block"
      />

  </div>
</template>

<script>
import Chart from './Chart.vue';
import moment from 'moment';

export default {
  name: 'LineChartContainer',

  components: { Chart },

  props: ['country'],

  data: () => ({
    loading: true,
    alert: {
      show: false,
      closable: false,
      title: "Failed to load graph data",
      description: `Data for the graphs on this page are obtained from Github pages.
      The service is probably down. Details follow: `,
    },
    countryName: '',
    loadedNew: false,
    loadedTotals: false,
    chartDataTotalInfected: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Total Infected',
          borderColor: '#2a4365',
          backgroundColor: '#42424270',
        },
      ],
    },
    optionsTotalInfected: {
      title: {
        display: false,
        text: '',
      }
    },

    chartDataNewInfected: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'New Infected',
          borderColor: '#2a4365',
          backgroundColor: '#42424270',
        },
      ],
    },
    optionsNewInfected: {
      title: {
        display: false,
        text: '',
      }
    },

    chartDataTotalDeaths: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'Total Deaths',
          borderColor: '#2a4365',
          backgroundColor: '#42424270',
        },
      ],
    },
    optionsTotalDeaths: {
      title: {
        display: false,
        text: '',
      }
    },

    chartDataNewDeaths: {
      labels: [],
      datasets: [
        {
          data: [],
          label: 'New Deaths',
          borderColor: '#2a4365',
          backgroundColor: '#42424270',
        },
      ],
    },
    optionsNewDeaths: {
      title: {
        display: false,
        text: '',
      }
    },
  }),

  methods: {
    async fetchCountryNewStats(country) {
      try {
        const response = await fetch('https://open-covid-19.github.io/data/data_categories.json');
        const json = await response.json();

        json.forEach(dataPoint => {
          if (dataPoint.Key === country) {
            const date = moment(dataPoint.Date, 'YYYY-MM-DD');
            if (date.isValid()) {
              const label = date.format('YYYY-MM-DD');

              this.chartDataNewInfected.labels.push(label);
              this.chartDataNewInfected.datasets[0].data.push(dataPoint.NewCases);

              this.chartDataNewDeaths.labels.push(label);
              this.chartDataNewDeaths.datasets[0].data.push(dataPoint.NewDeaths);
            }
          }
        });
      } catch (err) {
        this.alert.show = true;
        this.alert.description += err;
        return false;
      }

      return true;
    },

    async fetchCountryDeaths(country) {
      try {
        const response = await fetch('https://open-covid-19.github.io/data/data_minimal.json');
        const json = await response.json();

        json.forEach(dataPoint => {
          if (dataPoint.Key === country) {
            const date = moment(dataPoint.Date, 'YYYY-MM-DD');
            if (date.isValid()) {
              const label = date.format('YYYY-MM-DD');

              this.chartDataTotalDeaths.labels.push(label);
              this.chartDataTotalDeaths.datasets[0].data.push(dataPoint.Deaths);

              this.chartDataTotalInfected.labels.push(label);
              this.chartDataTotalInfected.datasets[0].data.push(dataPoint.Confirmed);
            }
          }
        });
      } catch (err) {
        this.alert.show = true;
        this.alert.description += err;
        return false;
      }
      
      return true;
    },

    async getCountryName(country) {
      const localStorageKey = 'countrylisting';
      let countryListing;
      let countryListingString = localStorage.getItem(localStorageKey);
      try {
        countryListing = JSON.parse(countryListingString);
      } catch (err) {
        countryListing = null;
      }
      if (!countryListing || Array.isArray(countryListing) || !countryListing.length) {
        countryListing = {};
        const response = await fetch('https://api.covid19api.com/countries');
        const json = await response.json();
        json.forEach(ct => {
          countryListing[ct.ISO2] = ct.Country;
        });

        localStorage.setItem(localStorageKey, JSON.stringify(countryListing));
      }
      return countryListing[country];
    },
  },

  async mounted () {
    this.getCountryName(this.country)
      .then(a => { this.countryName = a });

    Promise.all([
      this.fetchCountryNewStats(this.country),
      this.fetchCountryDeaths(this.country),
    ]).then(results => {
      if (Array.isArray(results) && results.every(result => result)) {
        this.loadedNew = true;
        this.loadedTotals = true;
        setTimeout(() => { this.loading = false }, 1000);
      }
    });
  }
}
</script>
