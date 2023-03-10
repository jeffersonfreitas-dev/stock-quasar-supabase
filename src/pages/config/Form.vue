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
          v-model="form.name"
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

export default defineComponent({
  name: 'PageFormConfig',
  setup () {
    const table = 'config'
    const router = useRouter()
    const { setBrand } = useBrand()
    const { create, listPublic, update, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    let config = {}
    const paralax = ref([])
    const form = ref({
      name: '',
      phone: '',
      primary: '',
      secondary: '',
      img_paralax: ''
    })

    onMounted(() => {
      handleGetConfig()
    })

    const handleSubmit = async () => {
      try {
        if (paralax.value.length > 0) {
          const imgUrl = await uploadImg(paralax.value[0], 'paralax')
          form.value.img_paralax = imgUrl
        }
        if (form.value.id) {
          await update(table, form.value)
          notifySuccess(`${form.value.name} atualizado com sucesso`)
        } else {
          await create(table, form.value)
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
        config = await listPublic(table, user.value.id)
        form.value = config[0]
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
