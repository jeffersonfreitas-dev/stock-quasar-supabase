<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12"
        :loading="loading"
        :filter="filter"
        grid
      >
      <template v-slot:top>
          <span class="text-h6">
            Products
          </span>
          <q-space />
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search" class="q-mr-sm">
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
                <q-img :src="props.row.img_url" :ratio="4/3" />
                <q-card-section class="text-center">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12" v-if="props.rowIndex === 3 && brand.paralax_url" key="paralax">
              <q-parallax :height="200" :speed="0.5">
                <template v-slot:media>
                  <img :src="brand.paralax_url">
                </template>

                <h3 class="text-white">{{ brand.name }}</h3>
              </q-parallax>
            </div>
          </transition-group>
        </template>
      </q-table>
    </div>
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { columnsProduct } from './table'
import { useRoute } from 'vue-router'
import { formatCurrency } from 'src/utils/format'
import DialogProductDetails from 'src/components/DialogProductDetails.vue'

export default defineComponent({
  name: 'PageProductPublic',
  components: {
    DialogProductDetails
  },
  setup () {
    const { listPublic } = useApi()
    const { notifyError } = useNotify()
    const products = ref([])
    const loading = ref(true)
    const table = 'product'
    const route = useRoute()
    const filter = ref('')
    const showDialogDetails = ref(false)
    const productDetails = ref({})

    const handleListProducts = async (userId) => {
      try {
        loading.value = true
        products.value = await listPublic(table, userId)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowDetails = (product) => {
      productDetails.value = product
      showDialogDetails.value = true
    }

    onMounted(() => {
      if (route.params.id) {
        handleListProducts(route.params.id)
      }
    })

    return {
      columnsProduct,
      products,
      loading,
      formatCurrency,
      filter,
      showDialogDetails,
      productDetails,
      handleShowDetails
    }
  }
})
</script>
