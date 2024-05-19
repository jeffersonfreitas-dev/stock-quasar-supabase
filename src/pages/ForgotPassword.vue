<template>
  <q-page padding>
    <q-form class="row justify-center q-mt-lg" @submit.prevent="handleForgotPassword">
      <h3 class="col-12 text-h5 text-center">{{ $t('reset_password') }}</h3>
      <div class="col-md-8 col-sm-8 col-xs-10 q-gutter-y-md">
        <q-input label="Email" filled v-model="email" lazy-rules :rules="[val => (val && val.length > 0) || $t('required')]" type="email"/>

        <div class=" row justify-center">
          <q-btn align="around"
          class="btn-fixed-width q-py-md"
          icon="mark_email_read"
          color="primary"
          :label="$t('send_reset_email')"
          type="submit"/>
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
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'PageForgotPassword',
  setup () {
    const { sendPasswordRestEmail } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const email = ref('')
    const $q = useQuasar()

    const handleForgotPassword = async () => {
      try {
        $q.loading.show({
          message: 'Preparando o envio do e-mail de recuperação...'
        })
        await sendPasswordRestEmail(email.value)
        $q.loading.hide()
        notifySuccess(`E-mail para recuperação de senha enviado para: ${email.value}`)
      } catch (error) {
        $q.loading.hide()
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
