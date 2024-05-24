<template>
  <q-page padding>
    <div class="row justify-center">
      <h3>StockSet</h3>
    </div>
    <q-form class="row justify-center q-mt-lg" @submit.prevent="handleRegister">
      <h3 class="col-12 text-h5 text-center">{{ $t('btn_register') }}</h3>
      <div class="col-md-8 col-sm-8 col-xs-10 q-gutter-y-md">
        <q-input
          filled
          :label="$t('entity_name')"
          v-model="form.name"
          lazy-roles
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <q-input
          filled
          :label="$t('entity_email')"
          v-model="form.email"
          lazy-roles
          :rules="[val => (val && val.length > 0) || $t('required')]"
          type="email"
        />
        <q-input v-model="form.password" filled :type="isPwd ? 'password' : 'text'" :label="$t('entity_password')" :rules="[val => (val && val.length > 0) || $t('required')]">
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
          icon="account_circle"
          color="primary"
          :label="$t('btn_register')"
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
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageRegister',
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const { register } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const isPwd = ref(true)

    const form = ref({
      name: '',
      email: '',
      password: ''
    })
    const handleRegister = async () => {
      try {
        $q.loading.show({
          message: 'Cadastrando o novo usuário...'
        })
        await register(form.value)
        $q.loading.hide()
        notifySuccess(`${form.value.name} cadastro realizado com sucesso!`)
        router.push({ name: 'email-confirmation', query: { email: form.value.email } })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }
    return {
      form,
      isPwd,
      handleRegister
    }
  }
})
</script>
