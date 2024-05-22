<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ $t('config') }}
        </p>
      </div>
      <q-form class="col-md-8 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          filled
          :label=" $t('entity_name')"
          v-model="form.company"
          :rules="[val => (val && val.length > 0) ||  $t('required')]"
        />
        <q-input
          filled
          :label=" $t('entity_phone')"
          v-model="form.phone"
          :rules="[val => (val && val.length > 0) || $t('required')]"
          mask="(##) #####-####"
          unmasked-value
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color v-model="form.primary" class="col-md-4 col-sm-4 col-xs-12"/>
          <q-color v-model="form.secondary"  class="col-md-4 col-sm-4 col-xs-12" />
        </div>

        <div class=" row justify-center">
          <q-btn align="around"
          class="btn-fixed-width q-py-md"
          icon="save"
          color="primary"
          :label="$t('btn_save')"
          type="submit"/>
        </div>

        <q-btn
          :label="$t('btn_cancel')"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'me' }"
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
import { v4 as uuidv4 } from 'uuid'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageFormConfig',
  setup () {
    const router = useRouter()
    const { setBrand } = useBrand()
    const { create, list, update, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const $q = useQuasar()
    const store = useStore()

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
          $q.loading.show({
            message: 'Realizando o upload da imagem do paralax...'
          })
          const uuidImg = uuidv4()
          const imgUrl = await uploadImg(paralax.value[0], store.getters.user.uuid, uuidImg)
          form.value.img_paralax = imgUrl
          form.value.uuid_paralax = uuidImg
        }
        if (form.value.uuid) {
          $q.loading.show({
            message: 'Atualizando as configurações...'
          })
          await update('users', store.getters.user.uuid, 'config', form.value.uuid, form.value)
          notifySuccess('Configurações atualizadas com sucesso')
        } else {
          $q.loading.show({
            message: 'Salvando as configurações...'
          })
          const uuidConfig = uuidv4()
          form.value.uuid = uuidConfig
          await create('users', store.getters.user.uuid, form.value, 'config')
          notifySuccess('Configurações salvas com sucesso')
        }
        setBrand(form.value.primary, form.value.secondary)
        $q.loading.hide()
        router.push({ name: 'me' })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleGetConfig = async () => {
      try {
        $q.loading.show({
          message: 'Verificando as informações no banco de dados...'
        })
        config = await list('users', store.getters.user.uuid, 'config')
        if (config.length > 0) {
          form.value = config[0]
          console.log(form.value)
        }
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
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
