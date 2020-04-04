<template>
  <div id="line-chart-container">
    <chart
      v-if="loaded"
      :chart-data="chartdata"
      :options="options"/>
  </div>
</template>

<script>
import Chart from './Chart.vue';
import moment from 'moment';

export default {
  name: 'LineChartContainer',

  components: { Chart },

  props: ['titleText', 'country'],

  data: () => ({
    loaded: false,
    chartdata: {
      labels: [],
      datasets: [
        {
          data: [],
          label: "",
        }
      ],
    },
    options: {
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
                const totalCases = countryTimeline[key].total_cases;
                const label = date.format('YYYY-MM-DD');

                this.chartdata.labels.push(label);
                this.chartdata.datasets[0].data.push(totalCases);
              }
            });
            this.chartdata.datasets[0].borderColor = 'black';
            this.chartdata.datasets[0].backgroundColor = '#edf2f796';
            this.chartdata.datasets[0].label = response.countrytimelinedata[0].info.title;

            this.loaded = true;
          });
      } catch (e) {
        console.error(e)
      }
    },
  },

  created() {
    this.options.title.text = this.titleText;
  },

  async mounted () {
    this.fetchCountryTimelineStats(this.country);
  }
}
</script>
