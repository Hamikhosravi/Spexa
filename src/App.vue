<template>
  <q-layout view="lHh Lpr lFf" class="layout" >
    <router-view />
  </q-layout>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'LayoutDefault',

  components: {
    // Login
  },

  setup () {
    return {
      leftDrawerOpen: ref(false)
    }
  }
}
</script>

<style scoped>
    .layout{
        background-color: lightgray;
    }
</style>
