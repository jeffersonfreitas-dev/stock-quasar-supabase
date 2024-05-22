<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>Seja bem-vindo(a) {{ user.name }}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageMe',
  setup () {
    const i18n = createI18n({ legacy: false })
    const { locale } = i18n
    const store = useStore()
    const user = ref(null)

    onMounted(async () => {
      user.value = store.getters.user
    })

    return {
      i18n,
      locale,
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'de', label: 'German' }
      ],
      user
    }
  }
})
</script>
