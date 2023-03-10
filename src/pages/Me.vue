<template>
  <q-page class="flex flex-center">
    <div v-if="user">
      <p>Hello {{ user.user_metadata.name }}</p>
      <q-btn label="English" @click="$i18n.locale='en-us'" />
      <q-btn label="Portugues" @click="$i18n.locale='pt-BR'" />
      <q-separator class="q-my-lg" />

      <q-btn :label="$t('failed')"/>
      <q-btn :label="$t('success')"/>
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
