<template>
  <q-page padding class="background-container">
    <div class="row justify-center">
      <h3>StockSet</h3>
    </div>
    <div class="row justify-center q-mb-lg">
      <p class ="grey-7" >{{ $t('subtitle') }}</p>
    </div>
    <q-form class="row justify-center align-items-center" @submit.prevent="handleLogin">
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">

        <q-input v-model="form.email" filled type="email" :rules="[val => (val && val.length > 0) || $t('required')]" :hint="$t('entity_email')">
          <template v-slot:append>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-input v-model="form.password" filled :type="isPwd ? 'password' : 'text'" :hint="$t('entity_password')" :rules="[val => (val && val.length > 0) || $t('required')]">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="row justify-end q-mb-lg">
          <div class=" row justify-center q-mr-md">
            <q-btn align="around"
            class="btn-fixed-width q-py-md"
            icon="login"
            color="primary"
            :label="$t('btn_login')"
            type="submit"/>
          </div>

          <div class=" row justify-center">
            <q-btn align="around"
            class="btn-fixed-width q-py-md"
            icon="person_add"
            color="primary"
            to="/register" />
          </div>

          <div class=" row justify-center q-ml-md">
            <q-btn align="around"
            class="btn-fixed-width q-py-md"
            icon="lock_reset"
            color="primary"
            :to="{ name: 'forgot-password' }" />
          </div>
        </div>

        <div class=" row justify-center q-mt-xl">
          <q-btn
            :label="$t('cont_google')"
            color="primary"
            icon="fab fa-google"
            size="md"
            class="q-py-md"
            outline
            @click="socialLogin()"
          />
        </div>

      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/UseNotify'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageLogin',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const store = useStore()
    const { notifyError } = useNotify()
    const isPwd = ref(true)

    const form = ref({
      email: '',
      password: ''
    })

    onMounted(() => {
      if (store.getters.isAuthenticated) {
        router.push({ name: 'me' })
      }
    })

    const handleLogin = async () => {
      try {
        $q.loading.show({
          message: 'Realizando o login...'
        })
        await store.dispatch('login', form.value)
        $q.loading.hide()
        if (store.getters.user) {
          router.push({ name: 'me' })
        }
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const socialLogin = async () => {
      $q.loading.show({
        message: 'Realizando o login...'
      })
      try {
        await store.dispatch('loginSocial', form.value)
        if (store.getters.user) {
          router.push({ name: 'me' })
        }
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }
    return {
      form,
      isPwd,
      socialLogin,
      handleLogin
    }
  }
})
</script>

<style scoped>
.background-container {
  background-image: url('/back.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100vw;
}
</style>
