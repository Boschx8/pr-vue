<template>
  <div id="app">
    <HeaderComponent />
    <main class="main">
      <router-view />
    </main>
    <NavigationComponent />
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import NavigationComponent from '@/components/NavigationComponent.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    NavigationComponent
  }
}
</script>

<style scoped>
.main {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}
</style>