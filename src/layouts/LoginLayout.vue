<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, onBeforeMount, ref } from 'vue'
import useBrand from 'src/composables/UseBrand'

export default defineComponent({
  name: 'LoginLayout',

  setup () {
    const { setBrand } = useBrand()
    const brandDefault = ref({
      primary: '#2c9c6a',
      secondary: '#26A69A'
    })

    onBeforeMount(async () => {
      setBrand(brandDefault.value.primary, brandDefault.value.secondary)
    })
  }
})
</script>
