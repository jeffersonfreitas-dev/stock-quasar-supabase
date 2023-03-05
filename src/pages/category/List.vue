<template>
  <q-page padding>
    <div class="row">
      <q-table :rows="categories" :columns="columns" row-key="id" class="col-12" :loading="loading">
        <template v-slot:top>
          <span class="text-h6">Category</span>
          <q-space />
          <q-btn label="Add New" color="primary" icon="mdi-plus" dense :to="{ name: 'form-category' }"/>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-pencil-outline" color="info" dense size="sm" @click="handleEdit(props.row)">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemove(props.row)">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'

const columns = [
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions', sortable: false }
]

export default defineComponent({
  name: 'PageCategoryList',
  setup () {
    const { list, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const categories = ref([])
    const loading = ref(true)
    const table = 'category'
    const $q = useQuasar()

    const handleListCategories = async () => {
      try {
        loading.value = true
        categories.value = await list(table)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleRemove = async (category) => {
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Do you really delete ${category.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, category.id)
          notifySuccess(`${category.name} removed successfully`)
          handleListCategories()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (category) => {
      router.push({ name: 'form-category', params: { id: category.id } })
    }

    onMounted(() => {
      handleListCategories()
    })

    return {
      columns,
      categories,
      loading,
      handleEdit,
      handleRemove
    }
  }
})
</script>
