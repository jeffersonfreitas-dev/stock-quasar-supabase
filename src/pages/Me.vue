<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>Seja bem-vindo(a) {{ user.name }}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import { createI18n } from 'vue-i18n'

export default defineComponent({
  name: 'PageMe',
  setup () {
    const { user } = useAuthUser()
    const i18n = createI18n({ legacy: false })
    const { locale } = i18n

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
