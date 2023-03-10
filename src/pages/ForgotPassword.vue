<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="col-12 text-h5 text-center">{{ $t('reset_password') }}</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Email" v-model="email" lazy-rules :rules="[val => (val && val.length > 0) || $t('required')]" type="email"/>
        <div class="full-width q-pt-md">
          <q-btn
            :label="$t('send_reset_email')"
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

export default defineComponent({
  name: 'PageForgotPassword',
  setup () {
    const { sendPasswordRestEmail } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const email = ref('')
    const handleForgotPassword = async () => {
      try {
        await sendPasswordRestEmail(email.value)
        notifySuccess(`E-mail para recuperação de senha enviado para: ${email.value}`)
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
