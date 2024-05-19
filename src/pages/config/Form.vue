<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ $t('config') }}
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          :label=" $t('entity_name')"
          v-model="form.company"
          :rules="[val => (val && val.length > 0) ||  $t('required')]"
        />
        <q-input
          :label=" $t('entity_phone')"
          v-model="form.phone"
          :rules="[val => (val && val.length > 0) || $t('required')]"
          mask="(##) #####-####"
          unmasked-value
        />

        <q-input
          label="Paralax"
          stack-label
          v-model="paralax"
          type="file"
          accept="image/*"
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color v-model="form.primary" class="col-md-4 col-sm-12 col-xs-12"/>
          <q-color v-model="form.secondary"  class="col-md-4 col-sm-12 col-xs-12" />
        </div>
        <q-btn
          :label="$t('btn_save')"
          color="primary"
          class="full-width"
          rounded type="submit"
        />
        <q-btn
          :label="$t('btn_cancel')"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'category' }"
        />
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
import useAuthUser from 'src/composables/UseAuthUser'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  name: 'PageFormConfig',
  setup () {
    const router = useRouter()
    const { setBrand } = useBrand()
    const { create, list, update, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    let config = {}
    const paralax = ref([])
    const form = ref({
      uuid: '',
      company: '',
      phone: '',
      primary: '',
      secondary: '',
      img_paralax: '',
      uuid_paralax: ''
    })

    onMounted(() => {
      handleGetConfig()
    })

    const handleSubmit = async () => {
      try {
        if (paralax.value.length > 0) {
          const uuidImg = uuidv4()
          const imgUrl = await uploadImg(paralax.value[0], user.value.uuid, uuidImg)
          form.value.img_paralax = imgUrl
          form.value.uuid_paralax = uuidImg
        }
        if (form.value.uuid) {
          await update('users', user.value.uuid, 'config', form.value.uuid, form.value)
          notifySuccess(`${form.value.name} atualizado com sucesso`)
        } else {
          const uuidConfig = uuidv4()
          form.value.uuid = uuidConfig
          await create('users', user.value.uuid, form.value, 'config')
          notifySuccess(`${form.value.name} salvo com sucesso`)
        }
        setBrand(form.value.primary, form.value.secondary)
        router.push({ name: 'me' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGetConfig = async () => {
      try {
        config = await list('users', user.value.uuid, 'config')
        if (config.length > 0) {
          console.log('dddd')
          form.value = config[0]
        }
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      handleSubmit,
      paralax
    }
  }
})
</script>
