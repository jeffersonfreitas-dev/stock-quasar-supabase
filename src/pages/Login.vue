<template>
  <q-page padding>
    <div class="row justify-center">
      <img src="../../public/icons/apple-icon-120x120.png" class="q-mt-lg" alt="logo"/>
    </div>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input
          :label="$t('entity_email')"
          v-model="form.email"
          :rules="[val => (val && val.length > 0) || $t('required')]"
          type="email"
        />
        <q-input
          type="password"
          :label="$t('entity_password')"
          v-model="form.password"
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <div class="full-width q-pt-md">
          <q-btn
            :label="$t('btn_login')"
            color="primary"
            class="full-width"
            rounded
            outline
            type="submit"
          />
        </div>
        <div class="full-width q-gutter-y-sm">
          <q-btn
            :label="$t('btn_register')"
            color="primary"
            class="full-width"
            size="sm"
            flat to="/register"
          />
          <q-btn
            :label="$t('btn_forgot_password')"
            color="primary"
            class="full-width"
            size="sm"
            flat
            :to="{ name: 'forgot-password' }"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageLogin',
  setup () {
    const router = useRouter()
    const { isLoggedIn, login } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const form = ref({
      email: '',
      password: ''
    })

    onMounted(() => {
      if (!isLoggedIn) {
        router.push({ name: 'me' })
      }
    })

    const handleLogin = async () => {
      try {
        await login(form.value)
        notifySuccess('Seja bem vindo(a)!')
        router.push({ name: 'me' })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      handleLogin
    }
  }
})
</script>
