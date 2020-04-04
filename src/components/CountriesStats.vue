<template>
  <div class="px-6">
    <h3 class="text-2xl font-bold text-gray-800">
      Per Country
      <small class="text-xs">Last update @ {{ last_update | toLocalDate }}</small>
    </h3>
    <small class="text-gray-800">Does not include countries with &lt; 100 total infection cases</small>
    <div class="mb-1">
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

    <hr>
  </div>
</template>

<script>
import numeral from 'numeral';

export default {
  name: "CountriesStats",

  data() {
    return {
      data: [],
      titles: [
        {
          prop: 'country',
          label: 'Country',
        },
        {
          prop: "total_infected",
          label: "Total Infected",
          formatter: this.formatNumber,
        },
        {
          prop: "new_cases",
          label: "New Cases",
          formatter: this.formatNumber,
        },
        {
          prop: "total_deaths",
          label: "Total Deaths",
          formatter: this.formatNumber,
        },
        {
          prop: "new_deaths",
          label: "New Deaths",
          formatter: this.formatNumber,
        },
        {
          prop: "total_recovered",
          label: "Total Recovered",
          formatter: this.formatNumber,
        },
        {
          prop: "death_rate",
          label: "Death Rate",
          formatter: this.formatPercentage,
        }
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
      chartCountry: 'es',
    };
  },

  created() {
    this.populateTable();
  },

  methods: {
    handleDoubleClick(row) {
      this.chartCountry = row.country_code;
      console.log(this.chartCountry);
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
      if (!storedData || !storedData.data || (storedData.saved + 300000) < Date.now()) {
        storedData = {
          data: [],
          saved: Date.now(),
        };
        this.fetchStats()
          .then(response => {
            let results = response.countryitems[0];
            Object.keys(results).forEach(key => {
              let ct = results[key];
              if (ct.total_cases >= 100) {
                storedData.data.push({
                  country: ct.title,
                  country_code: ct.code,
                  total_deaths: ct.total_deaths,
                  new_deaths: ct.total_new_deaths_today,
                  total_infected: ct.total_cases,
                  new_cases: ct.total_new_cases_today,
                  total_recovered: ct.total_recovered,
                  death_rate: (ct.total_deaths * 100) / ct.total_cases,
                });
              }
            });
            this.data = storedData.data;
            localStorage.setItem('stats', JSON.stringify(storedData));
          })
        ;
      } else {
        this.data = storedData.data;
      }

      this.last_update = storedData.saved;
    },
    fetchStats() {
      return fetch(`https://api.thevirustracker.com/free-api?countryTotals=ALL`)
        .then(res => res.json())
        
        .catch(err => console.error(err))
      ;
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
    }
  },

  filters: {
    toLocalDate(value) {
      return (new Date(value)).toLocaleString();
    },
  }
};
</script>
