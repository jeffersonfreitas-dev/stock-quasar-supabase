import { createStore } from 'vuex'
import useAuthUser from 'src/composables/UseAuthUser'

const { login: authLogin, loginSocial } = useAuthUser()

export default createStore({

  state: {
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser (state) {
      state.user = null
      localStorage.removeItem('user')
    }
  },
  actions: {
    async loginSocial ({ commit }) {
      try {
        const user = await loginSocial()
        commit('setUser', user)
      } catch (error) {
        throw Error(error)
      }
    },
    async login ({ commit }, form) {
      try {
        const user = await authLogin(form)
        commit('setUser', user)
      } catch (error) {
        throw Error(error)
      }
    },
    logout ({ commit }) {
      commit('clearUser')
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    user: state => state.user
  }
})
