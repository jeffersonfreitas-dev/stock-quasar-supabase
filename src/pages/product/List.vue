<template>
  <q-page padding>
    <div class="row">
      <q-table :rows="products" :columns="columnsProduct" row-key="id" class="col-12 q-mb-md" :loading="loading" hide-pagination>
        <template v-slot:top>
          <span class="text-h6">Product</span>
          <q-btn
            :label="$t('my_store')"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="mdi-store"
            color="primary"
            @click="handleGoToStore"
          />
          <q-btn
            :label="$t('copy_link')"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            icon="mdi-content-copy"
            color="primary"
            @click="handleCopyPublicLink"
          />
          <q-space />
          <q-btn
            :label="$t('btn_new')"
            color="primary"
            icon="mdi-plus"
            dense
            :to="{ name: 'form-product' }"
            v-if="$q.platform.is.desktop"
          />
        </template>
        <template v-slot:body-cell-img_url="props">
          <q-td :props="props">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url" />
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
    <div class="row justify-center">
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
import { useQuasar, copyToClipboard } from 'quasar'
import { columnsProduct, initialPagination } from './table'
import useAuthUser from 'src/composables/UseAuthUser'

export default defineComponent({
  name: 'PageProductList',
  setup () {
    const { listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const router = useRouter()
    const products = ref([])
    const loading = ref(true)
    const table = 'product'
    const $q = useQuasar()
    const { user } = useAuthUser()

    const handleListProducts = async () => {
      try {
        loading.value = true
        products.value = await listPublic(table, user.value.id)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleGoToStore = () => {
      const idUser = user.value.id
      router.push({ name: 'product-public', params: { id: idUser } })
    }

    const handleCopyPublicLink = () => {
      const idUser = user.value.id
      const link = router.resolve({ name: 'product-public', params: { id: idUser } })
      const externalLink = window.origin + link.href
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess('Link copidado com sucesso')
        }).catch((error) => {
          notifyError(error.message)
        })
    }

    const handleRemove = async (product) => {
      try {
        $q.dialog({
          title: 'Deletar',
          message: `Deseja realmente deletar ${product.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, product.id)
          notifySuccess(`${product.name} deletado com sucesso`)
          handleListProducts()
        })
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleEdit = (product) => {
      router.push({ name: 'form-product', params: { id: product.id } })
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
      loading,
      handleEdit,
      handleRemove,
      handleGoToStore,
      handleCopyPublicLink,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
