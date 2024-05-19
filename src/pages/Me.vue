<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>Seja bem-vindo(a) {{ user.name }}</p>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import { createI18n } from 'vue-i18n'
import useBrand from 'src/composables/UseBrand'
import useApi from 'src/composables/UseApi'

export default defineComponent({
  name: 'PageMe',
  setup () {
    const { user } = useAuthUser()
    const { list } = useApi()
    const i18n = createI18n({ legacy: false })
    const { locale } = i18n
    const { setBrand } = useBrand()

    onMounted(async () => {
      const config = await list('users', user.value.uuid, 'config')
      if (config.length > 0) {
        setBrand(config.primary, config.secondary)
      }
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
