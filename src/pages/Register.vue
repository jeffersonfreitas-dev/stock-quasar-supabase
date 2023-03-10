<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center">{{ $t('btn_register') }}</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input
          :label="$t('entity_name')"
          v-model="form.name"
          lazy-roles
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <q-input
          :label="$t('entity_email')"
          v-model="form.email"
          lazy-roles
          :rules="[val => (val && val.length > 0) || $t('required')]"
          type="email"
        />
        <q-input
          :label="$t('entity_password')"
          v-model="form.password"
          lazy-roles
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <div class="full-width q-pt-md">
          <q-btn
            :label="$t('btn_register')"
            color="primary"
            class="full-width"
            rounded
            outline
            type="submit"
          />
        </div>
        <div class="full-width">
          <q-btn
            :label="$t('btn_back')"
            color="primary"
            class="full-width"
            flat
            to="/login"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageRegister',
  setup () {
    const router = useRouter()
    const { register } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const form = ref({
      name: '',
      email: '',
      password: ''
    })
    const handleRegister = async () => {
      try {
        await register(form.value)
        notifySuccess(`${form.value.name} cadastro realizado com sucesso!`)
        router.push({ name: 'email-confirmation', query: { email: form.value.email } })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      handleRegister
    }
  }
})
</script>
