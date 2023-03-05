import { formatCurrency } from 'src/utils/format'

const columnsProduct = [
  { name: 'img_url', align: 'left', label: 'Img', field: 'img_url', sortable: false },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'amount', align: 'left', label: 'Amount', field: 'amount', sortable: true },
  { name: 'price', align: 'left', label: 'Price', field: 'price', sortable: true, format: (val) => formatCurrency(val) },
  { name: 'actions', align: 'right', label: '', field: 'actions', sortable: false }
]

export {
  columnsProduct
}