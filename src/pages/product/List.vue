<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12 q-mb-md"
        v-model:pagination="initialPagination"
        hide-pagination
      >
        <template v-slot:top>
          <span class="text-h6">{{ $t('product') }}</span>
          <q-space />
          <q-btn
            align="around"
            class="btn-fixed-width q-py-md q-mr-lg"
            :label="$t('my_store')"
            color="primary"
            icon="mdi-store"
            @click="handleGoToStore"
          />
          <q-btn
            align="around"
            class="btn-fixed-width q-py-md q-mr-lg"
            :label="$t('btn_new')"
            color="primary"
            icon="add_task"
            :to="{ name: 'form-product' }"
            v-if="$q.platform.is.desktop"
          />
        </template>
        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url" alt="prod"/>
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white" icon="mdi-image-off" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-pencil-outline" color="info" dense size="sm" @click="handleEdit(props.row)">
              <q-tooltip>
                {{ $t('btn_edit') }}
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemove(props.row)">
              <q-tooltip>
                {{ $t('btn_delete') }}
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="row justify-center" v-if="products.length > initialPagination.rowsPerPage">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.platform.is.mobile">
      <q-btn fab icon="mdi-plus" color="primary" :to="{ name: 'form-product' }"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useQuasar } from 'quasar'
import { columnsProduct, initialPagination } from './table'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PageProductList',
  setup () {
    const { list, remove, removeImage } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const products = ref([])
    const $q = useQuasar()
    const store = useStore()

    const handleListProducts = async () => {
      try {
        $q.loading.show({
          message: 'Buscando os registros no banco de dados...'
        })
        products.value = await list('users', store.getters.user.uuid, 'products')
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleGoToStore = () => {
      const idUser = store.getters.user.uuid
      router.push({ name: 'product-public', params: { id: idUser } })
    }

    const handleRemove = async (product) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: `Deseja realmente deletar ${product.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          $q.loading.show({
            message: 'Realizando a exclusão do registro...'
          })

          await remove('users', store.getters.user.uuid, 'products', product.uuid)

          if (product.img_uuid) {
            $q.loading.show({
              message: 'Realizando a exclusão da imagem do produto...'
            })
            removeImage(store.getters.user.uuid, product.img_uuid)
          }
          $q.loading.hide()
          notifySuccess(`${product.name} deletado com sucesso`)
          handleListProducts()
        })
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleEdit = (product) => {
      router.push({ name: 'form-product', params: { id: product.uuid } })
    }

    const handleScrollToTop = () => {
      window.scroll({ top: 0, behavior: 'smooth' })
    }

    onMounted(() => {
      handleListProducts()
    })

    return {
      columnsProduct,
      products,
      handleEdit,
      handleRemove,
      handleGoToStore,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
