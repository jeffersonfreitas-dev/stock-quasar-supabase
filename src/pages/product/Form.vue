<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Form Product
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          label="Image"
          stack-label
          v-model="img"
          type="file"
          accept="image/*"
        />

        <q-input
          label="Name"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || 'Name is required']"
        />
        <q-editor
          label="Description"
          min-height="5rem"
          v-model="form.description"
        />
        <q-input
          label="Amount"
          type="number"
          v-model="form.amount"
          :rules="[val => !!val || 'Amount is required']"
        />
        <q-input
          label="Price"
          v-model="form.price"
          :rules="[val => !!val || 'Price is required']"
          prefix="R$"
        />
        <q-select
          v-model="form.category_id"
          :options="optionsCategory"
          label="Category"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[val => !!val || 'Category is required']"
        />
        <q-btn
          :label="isUpdate ? 'Update' : 'Save'"
          color="primary" class="full-width"
          rounded type="submit"
        />
        <q-btn
          label="Cancel"
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

export default defineComponent({
  name: 'PageFormProduct',
  setup () {
    const table = 'product'
    const router = useRouter()
    const route = useRoute()
    const { create, getById, update, list, uploadImg } = useApi()
    const { notifyError, notifySuccess } = useNotify()
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
      try {
        if (img.value.length > 0) {
          console.log(img.value)
          const imgUrl = await uploadImg(img.value[0], 'product')
          form.value.img_url = imgUrl
        }
        if (isUpdate.value) {
          await update(table, { ...form.value })
          notifySuccess(`${form.value.name} updated successfully`)
        } else {
          await create(table, form.value)
          notifySuccess(`${form.value.name} saved successfully`)
        }
        router.push({ name: 'product' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleListCategory = async () => {
      optionsCategory.value = await list('category')
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