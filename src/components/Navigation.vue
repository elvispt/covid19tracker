<template>
  <nav class="flex items-center justify-between flex-wrap bg-blue-900 p-6">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <span class="font-semibold text-xl tracking-tight">Covid19 Tracker</span>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <router-link to="/" class="block mt-4 lg:inline-block lg:mt-0 text-orange-300 hover:text-white mr-4">
          World Stats
        </router-link>
        <router-link to="/country-stats" class="block mt-4 lg:inline-block lg:mt-0 text-orange-300 hover:text-white mr-4">
          Country Stats
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
}
</script>

<script>
export default {
  name: 'Navigation',
}
</script>
