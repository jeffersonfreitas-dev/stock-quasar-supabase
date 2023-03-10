<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="categories"
        :columns="columnsCategory"
        v-model:pagination="initialPagination"
        row-key="id"
        class="col-12 q-mb-md"
        :loading="loading"
        hide-pagination
      >
        <template v-slot:top>
          <span class="text-h6">{{ $t('category') }}</span>
          <q-space />
          <q-btn
            :label="$t('btn_new')"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-category' }"
            v-if="$q.platform.is.desktop"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="info"
              dense
              size="sm"
              @click="handleEdit(props.row)"
            >
              <q-tooltip>
                {{ $t('btn_edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-delete-outline"
              color="negative"
              dense size="sm"
              @click="handleRemove(props.row)"
            >
              <q-tooltip>
                {{ $t('btn_delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="row justify-center">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.platform.is.mobile">
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-category' }"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'
import { columnsCategory, initialPagination } from './table'
import useAuthUser from 'src/composables/UseAuthUser'

export default defineComponent({
  name: 'PageCategoryList',
  setup () {
    const { listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const categories = ref([])
    const loading = ref(true)
    const table = 'category'
    const $q = useQuasar()
    const { user } = useAuthUser()

    const handleListCategories = async () => {
      try {
        loading.value = true
        categories.value = await listPublic(table, user.value.id)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleRemove = async (category) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: `Deseja realmente deletar ${category.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, category.id)
          notifySuccess(`${category.name} removido com sucesso!`)
          handleListCategories()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (category) => {
      router.push({ name: 'form-category', params: { id: category.id } })
    }

    const handleScrollToTop = () => {
      window.scroll({ top: 0, behavior: 'smooth' })
    }

    onMounted(() => {
      handleListCategories()
    })

    return {
      columnsCategory,
      categories,
      loading,
      handleEdit,
      handleRemove,
      handleScrollToTop,
      initialPagination,
      pagesNumber: computed(() => Math.ceil(categories.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
