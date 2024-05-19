<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="categories"
        :columns="columnsCategory"
        v-model:pagination="initialPagination"
        row-key="id"
        class="col-12 q-mb-md"
        hide-pagination
      >
        <template v-slot:top>
          <span class="text-h6">{{ $t('category') }}</span>
          <q-space />
          <q-btn
            align="around"
            class="btn-fixed-width q-py-md"
            :label="$t('btn_new')"
            color="primary"
            icon="add_task"
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
    <div class="row justify-center" v-if="categories.length > initialPagination.rowsPerPage">
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
    const { remove, list } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const $q = useQuasar()
    const { user } = useAuthUser()
    const categories = ref([])

    const handleListCategories = async () => {
      try {
        $q.loading.show({
          message: 'Buscando os registros no banco de dados...'
        })
        categories.value = await list('users', user.value.uuid, 'categories')
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
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
          $q.loading.show({
            message: 'Verificando se o registro está sendo usado...'
          })

          const produtos = await list('users', user.value.uuid, 'products')
          const exists = produtos.filter(prod => {
            return prod.category_id === category.uuid
          })
          $q.loading.hide()

          if (exists.length > 0) {
            notifyError('A categoria não pode ser excluída, pois está sendo usada por outro registro')
          } else {
            $q.loading.show({
              message: 'Realizando a exclusão do registro...'
            })
            await remove('users', user.value.uuid, 'categories', category.uuid)
            notifySuccess(`${category.name} removido com sucesso!`)
            handleListCategories()
            $q.loading.hide()
          }
        })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleEdit = (category) => {
      router.push({ name: 'form-category', params: { id: category.uuid } })
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
      handleEdit,
      handleRemove,
      handleScrollToTop,
      initialPagination,
      pagesNumber: computed(() => Math.ceil(categories.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
