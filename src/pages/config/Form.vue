<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Form Config
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Store Name"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || 'Store Name is required']"
        />
        <q-input
          label="`Phone"
          v-model="form.phone"
          :rules="[val => (val && val.length > 0) || 'Phone is required']"
          mask="(##) #####-####"
          unmasked-value
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color v-model="form.primary" class="col-md-4 col-sm-12 col-xs-12"/>
          <q-color v-model="form.secondary"  class="col-md-4 col-sm-12 col-xs-12" />
        </div>
        <q-btn label="Save" color="primary" class="full-width" rounded type="submit"/>
        <q-btn label="Cancel" color="primary" class="full-width" rounded flat :to="{ name: 'category' }"/>
      </q-form>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useBrand from 'src/composables/UseBrand'

export default defineComponent({
  name: 'PageFormConfig',
  setup () {
    const table = 'config'
    const router = useRouter()
    const { setBrand } = useBrand()
    const { create, list, update } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    let config = {}
    const form = ref({
      name: '',
      phone: '',
      primary: '',
      secondary: ''
    })

    onMounted(() => {
      handleGetConfig()
    })

    const handleSubmit = async () => {
      try {
        if (form.value.id) {
          await update(table, form.value)
          notifySuccess(`${form.value.name} updated successfully`)
        } else {
          await create(table, form.value)
          notifySuccess(`${form.value.name} saved successfully`)
        }
        setBrand(form.value.primary, form.value.secondary)
        router.push({ name: 'me' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetConfig = async (id) => {
      try {
        config = await list(table)
        form.value = config[0]
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      handleSubmit
    }
  }
})
</script>