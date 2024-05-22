import { formatCurrency } from 'src/utils/format'
import { ref } from 'vue'

const columnsProduct = [
  { name: 'img_url', align: 'left', label: 'Imagem', field: 'img_url', sortable: false },
  { name: 'name', align: 'left', label: 'Nome', field: 'name', sortable: true },
  { name: 'price', align: 'left', label: 'Preço', field: (val) => formatCurrency(parseFloat(val.price)), sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions', sortable: false }
]

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8
})

export {
  columnsProduct,
  initialPagination
}
