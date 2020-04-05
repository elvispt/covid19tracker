<template>
  <div id="home">
    <world-stats></world-stats>
  </div>
</template>

<script>
import WorldStats from '@/components/WorldStats.vue';

export default {
  name: 'App',
  components: {
    WorldStats,
  },
}
</script>
