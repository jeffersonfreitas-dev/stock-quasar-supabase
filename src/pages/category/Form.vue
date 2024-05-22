<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center q-mt-lg">
        <p class="text-h6">
          {{ $t('category') }}
        </p>
      </div>
      <q-form class="col-md-8 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handleSubmit">
        <q-input
          filled
          :label="$t('entity_name')"
          v-model="form.name"
          :rules="[val => (val && val.length > 0) || $t('required')]"
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
import { v4 as uuidv4 } from 'uuid'
import { useQuasar } from 'quasar'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageFormCategory',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const { update, create, getById, list } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const $q = useQuasar()
    const store = useStore()

    const form = ref({
      name: ''
    })

    const isUpdate = computed(() => route.params.id)

    onMounted(() => {
      if (isUpdate.value) {
        handleGetCategory(isUpdate.value)
      }
    })

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          $q.loading.show({
            message: 'Atualizando o registro...'
          })
          await update('users', store.getters.user.uuid, 'categories', isUpdate.value, { ...form.value })
          $q.loading.hide()
          notifySuccess(`${form.value.name} updated successfully`)
        } else {
          $q.loading.show({
            message: 'Salvando o registro...'
          })
          const categorias = await list('users', store.getters.user.uuid, 'categories')

          if (categorias.length >= 5) {
            throw new Error('O limite de inclusão de novas categorias foi atingido')
          }

          const newCategory = {
            uuid: uuidv4(),
            name: form.value.name,
            userId: store.getters.user.uuid
          }

          await create('users', store.getters.user.uuid, newCategory, 'categories')
          $q.loading.hide()
          notifySuccess(`${form.value.name} saved successfully`)
        }
        router.push({ name: 'category' })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleGetCategory = async (id) => {
      try {
        $q.loading.show({
          message: 'Verificando as informações no banco de dados...'
        })
        const category = await getById('users', store.getters.user.uuid, 'categories', id)
        form.value = category
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    return {
      form,
      handleSubmit,
      isUpdate
    }
  }
})
</script>
