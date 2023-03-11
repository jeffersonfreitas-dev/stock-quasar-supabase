<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Stock Set
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import UseApi from 'src/composables/UseApi'

export default defineComponent({
  name: 'LoginLayout',

  setup () {
    const { getBrand, brand } = UseApi()
    onMounted(() => {
      getBrand()
    })
    return {
      brand
    }
  }
})
</script>
