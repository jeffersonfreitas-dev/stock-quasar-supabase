<template>
  <q-page padding>
    <div class="row justify-center">
      <h3>StockSet</h3>
    </div>
    <div class="row justify-center q-mb-lg">
      <p class ="grey-7" >Seu local para divulgação e vendas dos seus produtos</p>
    </div>
    <q-form class="row justify-center align-items-center" @submit.prevent="handleLogin">
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">

        <q-input v-model="form.email" filled type="email" :rules="[val => (val && val.length > 0) || $t('required')]" hint="E-mail">
          <template v-slot:append>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-input v-model="form.password" filled :type="isPwd ? 'password' : 'text'" hint="Senha" :rules="[val => (val && val.length > 0) || $t('required')]">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class=" row justify-center">
          <q-btn align="around"
          class="btn-fixed-width q-py-md"
          icon="login"
          color="primary"
          :label="$t('btn_login')"
          type="submit"/>
        </div>

        <div class=" row justify-center q-mt-lg">
          <q-btn
              :label="$t('btn_register')"
              color="primary"
              class="full-width"
              size="md"
              flat to="/register"
            />
        </div>

        <div class=" row justify-center">
          <q-btn
            :label="$t('btn_forgot_password')"
            color="primary"
            class="full-width"
            size="md"
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
import { useQuasar } from 'quasar'
import useAuthUser from 'src/composables/UseAuthUser'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'

export default defineComponent({
  name: 'PageLogin',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const { isLoggedIn, login } = useAuthUser()
    const { notifyError } = useNotify()
    const isPwd = ref(true)

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
        $q.loading.show({
          message: 'Realizando o login...'
        })
        await login(form.value)
        $q.loading.hide()
        router.push({ name: 'me' })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }
    return {
      form,
      isPwd,
      handleLogin
    }
  }
})
</script>
