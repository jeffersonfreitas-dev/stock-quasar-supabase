import { ref } from 'vue'
import { setDoc, getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore'
// import useAuthUser from './UseAuthUser'
// import { v4 as uuidv4 } from 'uuid'
// import { useRoute } from 'vue-router'
// import useBrand from 'src/composables/UseBrand'
// import { useQuasar } from 'quasar'

const brand = ref({
  uuid: '',
  primary: '',
  secondary: '',
  name: '',
  phone: '',
  img_paralax: ''
})

export default function () {
  // const { user } = useAuthUser()
  // const route = useRoute()
  // const { setBrand } = useBrand()
  // const $q = useQuasar()
  const db = getFirestore()

  const list = async (table, uuid, chield) => {
    const result = []
    const userRef = doc(db, table, uuid)
    const categoriesRef = collection(userRef, chield)

    const categories = await getDocs(categoriesRef)

    categories.forEach((doc) => {
      result.push(doc.data())
    })
    return result
  }

  const listPublic = async (table, userId, columnFilter = '', filter = '') => {
    // const { data, error } = await supabase.from(table).select('*').eq('user_id', userId).eq(columnFilter, filter)
    // if (error) throw error
    // return data
  }

  const getById = async (table, id) => {
    try {
      const refDoc = await doc(db, table, id)
      const docSnap = await getDoc(refDoc)
      if (docSnap.exists()) {
        brand.value.name = docSnap.data().name
        brand.value.uuid = id
        return brand.value
      } else {
        throw new Error('Usuário não encontrado')
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const create = async (table, uuid, form) => {
    try {
      await setDoc(doc(db, table, uuid), form)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const update = async (table, form) => {
    // const { data, error } = await supabase.from(table).update({ ...form }).match({ id: form.id })
    // if (error) throw error
    // return data
  }

  const remove = async (table, id) => {
    // const { data, error } = await supabase.from(table).delete().match({ id })
    // if (error) throw error
    // return data
  }

  const uploadImg = async (file, storage) => {
    // const fileName = uuidv4()
    // const { error } = supabase.storage.from(storage).upload(fileName, file, { cacheControl: '3600', upsert: false })
    // const publicUrl = await getUrlPublic(fileName, storage)
    // if (error) throw error
    // return publicUrl
  }

  const getUrlPublic = async (fileName, storage) => {
    // const { publicURL, error } = supabase.storage.from(storage).getPublicUrl(fileName)
    // if (error) throw error
    // return publicURL
  }

  const getBrand = async () => {
    // const id = route.params.id || user?.value?.id
    // if (id) {
    //   $q.loading.show({
    //     backgroundColor: 'dark-10'
    //   })
    //   const { data, error } = await supabase.from('config').select('*').eq('user_id', id)
    //   if (error) throw error
    //   if (data.length > 0) {
    //     brand.value = data[0]
    //     setBrand(brand.value.primary, brand.value.secondary)
    //   }
    //   $q.loading.hide()
    //   return brand
    // }
  }

  return {
    list,
    listPublic,
    getById,
    create,
    update,
    remove,
    uploadImg,
    getBrand,
    brand,
    getUrlPublic
  }
}
