<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handlePasswordReset">
      <p class="col-12 text-h5 text-center">Reset Password</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Password" v-model="password"/>
        <div class="full-width q-pt-md">
          <q-btn label="Send Reset Password" color="primary" class="full-width" rounded outline type="submit"/>
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
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'PageResetPassword',
  setup () {
    const { resetPassword } = useAuthUser()
    const route = useRoute()
    const token = route.query.token
    const router = useRouter()
    const password = ref('')
    const handlePasswordReset = async () => {
      try {
        await resetPassword(token, password.value)
        router.push({ name: 'login' })
      } catch (error) {
        alert(error.message)
      }
    }
    return {
      password,
      handlePasswordReset
    }
  }
})
</script>
