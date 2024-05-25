<template>
  <q-layout view="lHh Lpr lFf" class="background-container">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ name }}
        </q-toolbar-title>

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onBeforeMount } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useApi from 'src/composables/UseApi'
import useBrand from 'src/composables/UseBrand'
import { useStore } from 'vuex'

const linksList = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'mdi-home',
    routeName: 'me'
  },
  {
    title: 'Categorias',
    caption: '',
    icon: 'mdi-shape-outline',
    routeName: 'category'
  },
  {
    title: 'Produtos',
    caption: '',
    icon: 'mdi-archive',
    routeName: 'product'
  },
  {
    title: 'Configurações',
    caption: '',
    icon: 'mdi-cog',
    routeName: 'form-config'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()
    const $q = useQuasar()
    const { list } = useApi()
    const { setBrand } = useBrand()
    const store = useStore()
    const brandDefault = ref({
      primary: '#2c9c6a',
      secondary: '#26A69A'
    })
    const name = ref('StockSet')

    onBeforeMount(async () => {
      const config = await list('users', store.getters.user.uuid, 'config')
      if (config.length > 0) {
        setBrand(config[0].primary, config[0].secondary)
        name.value = config[0].company
      } else {
        setBrand(brandDefault.value.primary, brandDefault.value.secondary)
      }
    })

    const handleLogout = async () => {
      $q.dialog({ title: 'Sair', message: 'Deseja realmente sair?', cancel: true, persistent: true })
        .onOk(async () => {
          store.dispatch('logout')
          router.replace({ name: 'login' })
        })
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout,
      name
    }
  }
})
</script>

<style scoped>
.background-container {
  background-image: url('/back.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh;
  width: 100vw;
}
</style>
