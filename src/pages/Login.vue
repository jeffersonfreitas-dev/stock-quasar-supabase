<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Login</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Email" v-model="form.email" :rules="[val => (val && val.length > 0) || 'Email is required']" type="email"/>
        <q-input label="Password" v-model="form.password" :rules="[val => (val && val.length > 0) || 'Password is required']"/>
        <div class="full-width q-pt-md">
          <q-btn label="Login" color="primary" class="full-width" rounded outline type="submit"/>
        </div>
        <div class="full-width q-gutter-y-sm">
          <q-btn label="Register" color="primary" class="full-width" size="sm" flat to="/register"/>
          <q-btn label="Forgot Password" color="primary" class="full-width" size="sm" flat :to="{ name: 'forgot-password' }" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageLogin',
  setup () {
    const router = useRouter()
    const { login } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()

    const form = ref({
      email: '',
      password: ''
    })

    const handleLogin = async () => {
      try {
        await login(form.value)
        notifySuccess('All right! Wellcome')
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
