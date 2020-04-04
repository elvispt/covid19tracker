<template>
  <div id="app">
    <navigation></navigation>
    <div class='flex-1 mx-auto p-2'>
      <!-- views are injected here -->
      <router-view />
    </div>
    <!--
    <the-footer></the-footer>
    -->
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';
//import TheFooter from './components/TheFooter.vue';

export default {
  components: {
    Navigation,
    //TheFooter,
  },
}
</script>
