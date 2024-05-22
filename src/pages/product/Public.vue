<template>
  <q-page padding>
    <div class="row justify-center">
      <h3 v-if="configure.company">{{ configure.company }}</h3>
      <h3 v-else>StockSet</h3>
    </div>
    <div class="row justify-center q-mb-lg">
      <div class=" row justify-center">
            <q-btn align="around"
            class="btn-fixed-width"
            :label="$t('copy_link')"
            icon="share"
            color="primary"
            outline
            @click="handleCopyPublicLink" />
          </div>
    </div>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        v-model:pagination="initialPagination"
        class="col-12"
        :filter="filter"
        hide-pagination
        grid
      >
      <template v-slot:top>
          <span class="text-h6">
            Lista de Produtos
          </span>
          <q-space />
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Procurar por nome" class="q-mr-sm">
            <template v-slot:append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </template>
        <template v-slot:item="props">
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutRight"
          >
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
              <q-card class="cursor-pointer" v-ripple:primary @click="handleShowDetails(props.row)">
                <q-img v-if="props.row.img_url" :src="props.row.img_url" :ratio="4/3" />
                <q-img v-else src="/no-product.png" :ratio="4/3" />
                <q-card-section class="text-center">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ formatCurrency(parseFloat(props.row.price)) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </transition-group>
        </template>
      </q-table>
    </div>

    <div class="row justify-center q-mt-lg" v-if="products.length > initialPagination.rowsPerPage">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>

    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      :config="configure"
      @hide-dialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { columnsProduct, initialPagination } from './table'
import { useRoute, useRouter } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import DialogProductDetails from 'src/components/DialogProductDetails.vue'
import { copyToClipboard, useQuasar } from 'quasar'

export default defineComponent({
  name: 'PageProductPublic',
  components: {
    DialogProductDetails
  },
  setup () {
    const { list } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const products = ref([])
    const route = useRoute()
    const filter = ref('')
    const showDialogDetails = ref(false)
    const productDetails = ref({})
    const $q = useQuasar()
    const configure = ref({})
    const uuidUser = ref(null)
    const router = useRouter()

    const handleListProducts = async (userId) => {
      try {
        $q.loading.show({
          message: 'Aguarde, buscando produtos no banco de dados...'
        })
        products.value = await list('users', userId, 'products')
        const config = await list('users', userId, 'config')
        configure.value = config.length > 0 ? config[0] : {}
        $q.loading.hide()
      } catch (error) {
        $q.loading.hide()
        notifyError(error.message)
      }
    }

    const handleShowDetails = (product) => {
      productDetails.value = product
      showDialogDetails.value = true
    }

    onMounted(() => {
      if (route.params.id) {
        uuidUser.value = route.params.id
        handleListProducts(route.params.id)
      }
    })

    const handleCopyPublicLink = () => {
      const link = router.resolve({ name: 'product-public', params: { id: uuidUser.value } })
      const externalLink = window.origin + link.href
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess('Link copidado com sucesso')
        }).catch((error) => {
          notifyError(error.message)
        })
    }

    const handleScrollToTop = () => {
      window.scroll({ top: 0, behavior: 'smooth' })
    }

    return {
      columnsProduct,
      products,
      formatCurrency,
      filter,
      showDialogDetails,
      productDetails,
      handleShowDetails,
      configure,
      handleListProducts,
      route,
      handleCopyPublicLink,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
