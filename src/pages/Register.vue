<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center">Register</p>
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-input label="Name" v-model="form.name" lazy-roles :rules="[val => (val && val.length > 0) || 'Name is required']" />
        <q-input label="Email" v-model="form.email" lazy-roles :rules="[val => (val && val.length > 0) || 'Email is required']" type="email"/>
        <q-input label="Password" v-model="form.password" lazy-roles :rules="[val => (val && val.length > 0) || 'Password is required']"/>
        <div class="full-width q-pt-md">
          <q-btn label="Register" color="primary" class="full-width" rounded outline type="submit"/>
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
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PageRegister',
  setup () {
    const router = useRouter()
    const { register } = useAuthUser()
    const { notifyError, notifySuccess } = useNotify()
    const form = ref({
      name: '',
      email: '',
      password: ''
    })
    const handleRegister = async () => {
      try {
        await register(form.value)
        notifySuccess(`${form.value.name} registered successfully`)
        router.push({ name: 'email-confirmation', query: { email: form.value.email } })
      } catch (error) {
        notifyError(error.message)
      }
    }
    return {
      form,
      handleRegister
    }
  }
})
</script>
