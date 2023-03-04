<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="col-12 text-h5 text-center">Reset Password</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Email" v-model="email" lazy-rules :rules="[val => (val && val.length > 0) || 'Email is required']" type="email"/>
        <div class="full-width q-pt-md">
          <q-btn label="Send Reset Email" color="primary" class="full-width" rounded outline type="submit"/>
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

export default defineComponent({
  name: 'PageForgotPassword',
  setup () {
    const { sendPasswordRestEmail } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const email = ref('')
    const handleForgotPassword = async () => {
      try {
        await sendPasswordRestEmail(email.value)
        notifySuccess(`Password reset email send to: ${email.value}`)
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      email,
      handleForgotPassword
    }
  }
})
</script>
