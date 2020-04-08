<template>
  <div class="px-6">
    <h3 class="text-2xl font-bold text-gray-800" v-loading="loading">
      Per Country
      <small class="text-xs">Last update @ {{ last_update | toLocalDate }}</small>
    </h3>
    <el-alert
      :title="alert.title"
      type="info"
      class="text-xs"
      :closable="alert.closable"
    ></el-alert>
    <small class="text-gray-800"></small>
    
    <div class="mt-1">
      <el-row>
        <el-col :span="6">
          <el-input v-model="filters[0].value" placeholder="Find Country"></el-input>
        </el-col>
      </el-row>
    </div>
    <data-tables
      :data="data"
      :table-props="tableProps"
      :filters="filters"
      @row-dblclick="handleDoubleClick"
    >
      <el-table-column
        v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        :formatter="title.formatter"
        sortable="custom"
      ></el-table-column>
      
    </data-tables>
  </div>
</template>

<script>
import numeral from 'numeral';

export default {
  name: "CountriesStats",

  data() {
    return {
      loading: true,
      alert: {
        title: "Double click rows to view country specific graphs. Does not include countries with < 100 total infection cases",
        closable: false,
      },
      data: [],
      titles: [
        {
          prop: 'country',
          label: 'Country',
        },
        {
          prop: "total_infected",
          label: "Infected",
          formatter: this.formatNumber,
        },
        {
          prop: "infections_per_million",
          label: "Per Million",
          formatter: this.formatDecimalNumber,
        },
        {
          prop: "new_cases",
          label: "New Cases",
          formatter: this.formatNumber,
        },
        {
          prop: "total_deaths",
          label: "Deaths",
          formatter: this.formatNumber,
        },
        {
          prop: "death_per_million",
          label: "Per Million",
          formatter: this.formatDecimalNumber,
        },
        {
          prop: "new_deaths",
          label: "New Deaths",
          formatter: this.formatNumber,
        },
        {
          prop: "total_recovered",
          label: "Recovered",
          formatter: this.formatNumber,
        },
        {
          prop: "death_rate",
          label: "Death Rate",
          formatter: this.formatPercentage,
        },
      ],
      filters: [
        {
          prop: 'country',
          value: ''
        }
      ],
      tableProps: {
        defaultSort: {
          prop: 'total_infected',
          order: 'descending',
        },
      },
      last_update: '',
    };
  },

  created() {
    this.populateTable();
  },

  methods: {
    handleDoubleClick(row) {
      const countryCode = row.country_code;
      this.$router.push({
        name: 'CountryCharts',
        params: { country: countryCode },
        props: { country: countryCode, }
      });countryCode
    },
    populateTable() {
      let storedData = localStorage.getItem('stats');
      if (storedData) {
        try {
          storedData = JSON.parse(storedData);
        } catch (err) {
          storedData = null;
        }
      }
      if (!storedData || !storedData.data || (storedData.saved + 3600000) < Date.now()) {
        storedData = {
          data: [],
          saved: Date.now(),
        };
        this.fetchStats()
          .then(response => {
            let results = response.Countries;

            results.forEach(ct => {
              const totalCases = ct.TotalConfirmed;
              if (totalCases >= 100) {
                const totalDeaths = ct.TotalDeaths;
                const totalCases = ct.TotalConfirmed;
                const countryCode = ct.CountryCode;
                let countryData = {
                  country: ct.Country,
                  country_code: countryCode,
                  total_deaths: totalDeaths,
                  new_deaths: ct.NewDeaths,
                  total_infected: ct.TotalConfirmed,
                  new_cases: ct.NewConfirmed,
                  total_recovered: ct.TotalRecovered,
                  death_rate: (totalDeaths * 100) / totalCases,
                  death_per_million: null,
                  infections_per_million: null,
                };
                this.fetchCountryInfo(countryCode)
                  .then(response => {
                    if (response && Array.isArray(response) && response.length && response[0]) {
                      let population = response[0].population;
                      const millionsOfCitizens = (population / 1000000);
                      if (population) {
                        let deathPerMillion = totalDeaths / millionsOfCitizens;
                        countryData.death_per_million = deathPerMillion;
                        let infectionsPerMillion = countryData.total_infected / millionsOfCitizens;
                        countryData.infections_per_million = infectionsPerMillion;
                      }
                    }
                    return true;
                  })
                  .then(r => {
                    if (r) {
                      localStorage.setItem('stats', JSON.stringify(storedData));
                    }
                  })
                ;
                storedData.data.push(countryData);
              }
            });
            this.data = storedData.data;
          })
        ;
      } else {
        this.data = storedData.data;
      }

      this.last_update = storedData.saved;
      setTimeout(() => { this.loading = false }, 1000);
    },
    fetchStats() {
      return fetch('https://api.covid19api.com/summary')
        .then(res => res.json())
        .catch(err => console.error(err))
      ;
    },
    fetchCountryInfo(countryCodes) {
      return fetch(`https://restcountries.eu/rest/v2/alpha?codes=${countryCodes}`)
      .then(res => res.json())
      .catch(err => console.error(err))
    },
    formatPercentage(row) {
      let value = row.death_rate;
      return numeral(value).format('0.00') + '%';
    },
    formatNumber(row, column) {
      const property = column.property;
      let value = row[property];
      let formatted = numeral(value).format();
      return formatted.replace(new RegExp(',', 'g'), ' ');
    },
    formatDecimalNumber(row, column) {
      const property = column.property;
      let value = row[property];
      return numeral(value).format('0.000');
    },
  },

  filters: {
    toLocalDate(value) {
      return (new Date(value)).toLocaleString();
    },
  }
};
</script>
