<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center">Reset Password</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Password" type="password" v-model="password" lazy-rules :rules="[val => (val && val.length > 5) || 'Password is required and have to be greater than 5 characters']"/>
        <div class="full-width q-pt-md">
          <q-btn label="Send New Password" color="primary" class="full-width" rounded outline type="submit"/>
        </div>
        <div class="full-width">
          <q-btn label="Back" color="primary" class="full-width" flat to="/login"/>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'PageResetPassword',
  setup () {
    const { resetPassword } = useAuthUser()
    const route = useRoute()
    const { notifyError, notifySuccess } = useNotify()
    const token = route.query.token
    const router = useRouter()
    const password = ref('')
    const handlePasswordReset = async () => {
      try {
        await resetPassword(token, password.value)
        notifySuccess('Password reseted successfully')
        router.push({ name: 'login' })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      password,
      handlePasswordReset
    }
  }
})
</script>
