<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ $t('product') }}
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md " @submit.prevent="handleSubmit">
        <q-input
          :label="$t('entity_image')"
          stack-label
          v-model="img"
          type="file"
          accept="image/*"
        />

        <q-input
          :label="$t('entity_name')"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <q-editor
          :label="$t('entity_description')"
          min-height="5rem"
          v-model="form.description"
        />
        <q-input
          :label="$t('entity_price')"
          v-model="form.price"
          :rules="[val => !!val || $t('entity_price')]"
          prefix="R$"
        />
        <q-select
          v-model="form.category_id"
          :options="optionsCategory"
          :label="$t('entity_category')"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[val => !!val || $t('required')]"
        />
        <q-btn
          :label="isUpdate ? $t('btn_update') : $t('btn_save')"
          color="primary" class="full-width"
          rounded type="submit"
        />
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

export default defineComponent({
  name: 'PageFormProduct',
  setup () {
    const table = 'product'
    const router = useRouter()
    const route = useRoute()
    const { create, getById, update, listPublic, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    let product = {}
    const optionsCategory = ref([])
    const img = ref([])
    const form = ref({
      name: '',
      description: '',
      amount: 0,
      price: 0,
      category_id: '',
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
      form.value.price = form.value.price.replace(',', '.')
      try {
        if (img.value.length > 0) {
          console.log(img.value)
          const imgUrl = await uploadImg(img.value[0], 'product')
          form.value.img_url = imgUrl
        }
        if (isUpdate.value) {
          await update(table, { ...form.value })
          notifySuccess(`${form.value.name} atualizado com sucesso`)
        } else {
          await create(table, form.value)
          notifySuccess(`${form.value.name} salvo com sucesso`)
        }
        router.push({ name: 'product' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleListCategory = async () => {
      optionsCategory.value = await listPublic('category', user.value.id)
    }

    const handleGetProduct = async (id) => {
      try {
        product = await getById(table, id)
        form.value = product
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      form,
      handleSubmit,
      isUpdate,
      optionsCategory,
      img
    }
  }
})
</script>
