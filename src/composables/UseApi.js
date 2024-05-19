import { ref as vueRef } from 'vue'
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from 'src/boot/firebase'
// import useAuthUser from './UseAuthUser'
// import { v4 as uuidv4 } from 'uuid'
// import { useRoute } from 'vue-router'
// import useBrand from 'src/composables/UseBrand'
// import { useQuasar } from 'quasar'

const brand = vueRef({
  uuid: '',
  primary: '',
  secondary: '',
  name: '',
  phone: '',
  img_paralax: ''
})

export default function () {
  // const { user: uuu } = useAuthUser()
  // const route = useRoute()
  // const { setBrand } = useBrand()
  // const $q = useQuasar()

  const list = async (table, uuid, chield) => {
    try {
      const result = []
      const userRef = doc(db, table, uuid)
      const categoriesRef = collection(userRef, chield)
      const categories = await getDocs(categoriesRef)

      categories.forEach((doc) => {
        result.push(doc.data())
      })
      return result
    } catch (error) {
      console.log(error.message)
      throw new Error('Houve um erro ao listar todos os registros cadastrados')
    }
  }

  const getById = async (primaryCollection, primaryUUID, secondaryCollection, secondaryUUID) => {
    try {
      let docSnap = null
      if (secondaryCollection) {
        console.log(`/${primaryCollection}/${primaryUUID}/${secondaryCollection}/${secondaryUUID}`)
        docSnap = await getDoc(doc(db, primaryCollection, primaryUUID, secondaryCollection, secondaryUUID))
      } else {
        docSnap = await getDoc(doc(db, primaryCollection, primaryUUID))
      }

      if (docSnap !== null) {
        brand.value = docSnap.data()
        return brand.value
      } else {
        throw new Error('Usuário não encontrado')
      }
    } catch (error) {
      console.log(error.message)
      throw new Error('Houve um erro ao buscar o registro pelo código')
    }
  }

  const create = async (table, uuid, form, chield) => {
    try {
      if (chield) {
        await setDoc(doc(db, table, uuid, chield, form.uuid), form)
      } else {
        await setDoc(doc(db, table, uuid), form)
      }
    } catch (error) {
      console.log(error.message)
      throw new Error('Houve um erro ao criar o registro')
    }
  }

  const update = async (primaryCollection, primaryUUID, secondaryCollection, secondaryUUID, form) => {
    try {
      await updateDoc(doc(db, primaryCollection, primaryUUID, secondaryCollection, secondaryUUID), form)
    } catch (error) {
      console.log(error.message)
      throw new Error('Houve um erro ao atualizar o registro')
    }
  }

  const remove = async (primaryCollection, primaryUUID, secondaryCollection, secondaryUUID) => {
    try {
      if (secondaryCollection !== '') {
        await deleteDoc(doc(db, primaryCollection, primaryUUID, secondaryCollection, secondaryUUID))
      } else {
        await deleteDoc(doc(db, primaryCollection))
      }
    } catch (error) {
      console.log(error.message)
      throw new Error('Houve um erro ao deletar o registro')
    }
  }

  const listPublic = async (table, userId, columnFilter = '', filter = '') => {
    // const { data, error } = await supabase.from(table).select('*').eq('user_id', userId).eq(columnFilter, filter)
    // if (error) throw error
    // return data
  }

  const uploadImg = async (file, uuid, imgUUID) => {
    const path = `${uuid}/${imgUUID}`
    try {
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(ref(storage, path))
      return url
    } catch (error) {
      console.log(error.message)
      throw new Error('Erro ao realizar o upload da foto')
    }
  }

  const removeImage = async (uuid, imgUUID) => {
    const path = `${uuid}/${imgUUID}`
    try {
      const storageRef = ref(storage, path)
      deleteObject(storageRef)
        .then(() => console.log('Foto deletada' + imgUUID))
    } catch (error) {
      console.log(error.message)
    }
  }

  const getUrlPublic = async (fileName, storage) => {
    // const { publicURL, error } = supabase.storage.from(storage).getPublicUrl(fileName)
    // if (error) throw error
    // return publicURL
  }

  return {
    list,
    listPublic,
    getById,
    create,
    update,
    remove,
    uploadImg,
    removeImage,
    brand,
    getUrlPublic
  }
}
