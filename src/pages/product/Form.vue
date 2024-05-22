<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center q-mt-lg">
        <p class="text-h6">
          {{ $t('product') }}
        </p>
      </div>
      <q-form class="col-md-8 col-xs-12 col-sm-12 q-gutter-y-md " @submit.prevent="handleSubmit">
        <q-input
          filled
          :label="$t('entity_image')"
          stack-label
          v-model="img"
          type="file"
          accept="image/*"
        />

        <q-input
          filled
          :label="$t('entity_name')"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />

        <q-input
          filled
          :label="$t('entity_description')"
          v-model="form.description"
          type="textarea"
        />

        <q-input
          filled
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
          :label="$t('entity_price')"
          v-model="form.price"
          :rules="[val => !!val || $t('entity_price')]"
          :prefix="$t('entity_currency_type')"
        />

        <q-select
          filled
          v-model="categorySelected"
          :options="optionsCategory"
          :label="$t('entity_category')"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[val => !!val || $t('required')]"
        />

        <div class=" row justify-center">
          <q-btn align="around"
          class="btn-fixed-width q-py-md"
          icon="save"
          color="primary"
          :label="isUpdate ? $t('btn_update') : $t('btn_save')"
          type="submit"/>
        </div>

        <q-btn
          :label="$t('btn_cancel')"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'product' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import { v4 as uuidv4 } from 'uuid'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'PageFormProduct',
  setup () {
    const table = 'product'
    const router = useRouter()
    const route = useRoute()
    const { create, getById, update, list, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    let product = {}
    const $q = useQuasar()
    const categorySelected = ref()
    const optionsCategory = ref([])
    const img = ref([])
    const form = ref({
      name: '',
      description: '',
      amount: 0,
      price: 0.0,
      category_id: '',
      img_uuid: '',
      img_url: ''
    })

    const isUpdate = computed(() => route.params.id)
    onMounted(() => {
      handleListCategory()
      if (isUpdate.value) {
        handleGetProduct(isUpdate.value)
      }
    })

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          $q.loading.show({
            message: 'Realizando o upload da imagem do produto...'
          })
          const imgUUID = uuidv4()
          const url = await uploadImg(img.value[0], user.value.uuid, imgUUID)
          form.value.img_uuid = imgUUID
          form.value.img_url = url
        }
        if (isUpdate.value) {
          $q.loading.show({
            message: 'Atualizando o registro...'
          })
          await update(table, { ...form.value })
          notifySuccess(`${form.value.name} atualizado com sucesso`)
        } else {
          $q.loading.show({
            message: 'Salvando o registro...'
          })

          const produtos = await list('users', user.value.uuid, 'products')

          if (produtos.length >= 20) {
            throw new Error('O limite de inclusão de novos produtos foi atingido')
          }

          form.value.uuid = uuidv4()
          form.value.category_id = categorySelected.value.uuid
          await create('users', user.value.uuid, form.value, 'products')
          notifySuccess(`${form.value.name} salvo com sucesso`)
        }
        $q.loading.hide()
        router.push({ name: 'product' })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleListCategory = async () => {
      try {
        $q.loading.show({
          message: 'Verificando as informações no banco de dados...'
        })
        optionsCategory.value = await list('users', user.value.uuid, 'categories')
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleGetProduct = async (id) => {
      try {
        $q.loading.show({
          message: 'Verificando as informações no banco de dados...'
        })
        product = await getById(table, id)
        form.value = product
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    return {
      form,
      handleSubmit,
      isUpdate,
      categorySelected,
      optionsCategory,
      img
    }
  }
})
</script>
