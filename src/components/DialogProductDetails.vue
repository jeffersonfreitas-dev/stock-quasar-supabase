<template>
  <q-dialog :model-value="show" @before-hide="handleClose" :full-width="$q.platform.is.mobile">
    <q-card>
      <q-card-section>
        <div class="text-h6">

        </div>
      </q-card-section>
      <q-card-section v-if="product.img_url">
        <q-img :src="product.img_url" :radio="4/3" styled="min-width: 300px"/>
      </q-card-section>
      <q-card-section>
        <div class="text-h6">
          {{ product.name }}
        </div>
        <div class="text-subtitle2">
          {{ formatCurrency(product.price) }}
        </div>
        <div class="text-body2" v-html="product.description"></div>
      </q-card-section>
      <q-card-actions align="right">
          <q-btn label="Cancel" color="primary" outline v-close-popup />
          <q-btn
            v-if="brand.phone"
            label="Fazer Pedido"
            icon="mdi-whatsapp"
            color="green-7"
            @click="handleSendWpp"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { formatCurrency } from 'src/utils/format'
import { openURL } from 'quasar'
import UseApi from 'src/composables/UseApi'

export default defineComponent({
  name: 'DialogProductDetails',
  props: {
    product: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const msg = 'Eu estou muito interessado em comprar esse produto:'
    const { brand } = UseApi()

    const handleClose = () => {
      emit('hideDialog')
    }

    const handleSendWpp = () => {
      const link = encodeURI(`https://api.whatsapp.com/send?phone=55${brand.value.phone}&text=${msg} - ${props.product.name} - ${formatCurrency(props.product.price)}`)
      openURL(link)
    }

    return {
      formatCurrency,
      handleClose,
      handleSendWpp,
      brand
    }
  }
})
</script>
