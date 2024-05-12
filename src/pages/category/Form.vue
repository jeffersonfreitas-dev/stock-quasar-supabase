<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ $t('category') }}
        </p>
      </div>
      <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          :label="$t('entity_name')"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || $t('required')]"
        />
        <q-btn
          :label="isUpdate ? $t('btn_update') : $t('btn_save')"
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
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import useAuthUser from 'src/composables/UseAuthUser'
import db from 'src/utils/database/users'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  name: 'PageFormCategory',
  setup () {
    const table = 'category'
    const router = useRouter()
    const route = useRoute()
    const { update } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()
    // const category = {}

    const form = ref({
      name: ''
    })

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
      // if (isUpdate.value) {
      //   handleGetCategory(isUpdate.value)
      // }
    })

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, { ...form.value })
          notifySuccess(`${form.value.name} updated successfully`)
        } else {
          const newCategory = {
            uuid: uuidv4(),
            name: form.value.name,
            userId: user.uuid
          }
          db.categories.push(newCategory)
          notifySuccess(`${form.value.name} saved successfully`)
        }
        router.push({ name: 'category' })
      } catch (error) {
        notifyError(error.message)
      }
    }

    // const handleGetCategory = async (id) => {
    //   try {
    //     category = db.categories.filter(obj => obj.uuid === id)
    //     form.value = category
    //   } catch (error) {
    //     notifyError(error.message)
    //   }
    // }

    return {
      form,
      handleSubmit,
      isUpdate
    }
  }
})
</script>
