<template>
  <div id="line-chart-container">
    <chart
      v-if="loaded"
      :chart-data="chartDataTotalInfected"
      :options="optionsTotalInfected"
      class="w-2/4 inline-block"
      />

    <chart
      v-if="loaded"
      :chart-data="chartDataNewInfected"
      :options="optionsNewInfected"
      class="w-2/4 inline-block"
      />

      <hr class="my-3">

      <chart
      v-if="loaded"
      :chart-data="chartDataTotalDeaths"
      :options="optionsTotalDeaths"
      class="w-2/4 inline-block"
      />

    <chart
      v-if="loaded"
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
    loaded: false,
    chartDataTotalInfected: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
        }
      ],
    },
    optionsTotalInfected: {
      title: {
        display: true,
        text: '',
      }
    },

    chartDataNewInfected: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
        }
      ],
    },
    optionsNewInfected: {
      title: {
        display: true,
        text: '',
      }
    },

    chartDataTotalDeaths: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
        }
      ],
    },
    optionsTotalDeaths: {
      title: {
        display: true,
        text: '',
      }
    },

    chartDataNewDeaths: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
        }
      ],
    },
    optionsNewDeaths: {
      title: {
        display: true,
        text: '',
      }
    },
  }),

  methods: {
    fetchCountryTimelineStats(country) {
      this.loaded = false;
      try {
        fetch(`https://api.thevirustracker.com/free-api?countryTimeline=${country}`)
          .then(res => res.json())
          .then(response => {
            const countryTimeline = response.timelineitems[0];

            Object.keys(countryTimeline).forEach(key => {
              const date = moment(key, 'MM-DD-YYYY');
              if (date.isValid()) {
                const label = date.format('YYYY-MM-DD');

                const totalCases = countryTimeline[key].total_cases;
                this.chartDataTotalInfected.labels.push(label);
                this.chartDataTotalInfected.datasets[0].data.push(totalCases);

                const newDailyCases = countryTimeline[key].new_daily_cases;
                this.chartDataNewInfected.labels.push(label);
                this.chartDataNewInfected.datasets[0].data.push(newDailyCases);

                const totalDeaths = countryTimeline[key].total_deaths;
                this.chartDataTotalDeaths.labels.push(label);
                this.chartDataTotalDeaths.datasets[0].data.push(totalDeaths);

                const newDeaths = countryTimeline[key].new_daily_deaths;
                this.chartDataNewDeaths.labels.push(label);
                this.chartDataNewDeaths.datasets[0].data.push(newDeaths);
              }
            });

            this.chartDataTotalInfected.datasets[0].borderColor = 'black';
            this.chartDataTotalInfected.datasets[0].backgroundColor = '#edf2f796';
            this.chartDataTotalInfected.datasets[0].label = response.countrytimelinedata[0].info.title;

            this.chartDataNewInfected.datasets[0].borderColor = 'black';
            this.chartDataNewInfected.datasets[0].backgroundColor = '#edf2f796';
            this.chartDataNewInfected.datasets[0].label = response.countrytimelinedata[0].info.title;

            this.chartDataTotalDeaths.datasets[0].borderColor = 'black';
            this.chartDataTotalDeaths.datasets[0].backgroundColor = '#edf2f796';
            this.chartDataTotalDeaths.datasets[0].label = response.countrytimelinedata[0].info.title;

            this.chartDataNewDeaths.datasets[0].borderColor = 'black';
            this.chartDataNewDeaths.datasets[0].backgroundColor = '#edf2f796';
            this.chartDataNewDeaths.datasets[0].label = response.countrytimelinedata[0].info.title;

            this.loaded = true;
          });
      } catch (e) {
        console.error(e)
      }
    },
  },

  created() {
    this.optionsTotalInfected.title.text = "Total Infected Cases Timeline";
    this.optionsNewInfected.title.text = "New Infected Cases Timeline";

    this.optionsTotalDeaths.title.text = "Total Deaths Timeline";
    this.optionsNewDeaths.title.text = "New Deaths Timeline";
  },

  async mounted () {
    this.fetchCountryTimelineStats(this.country);
  }
}
</script>
