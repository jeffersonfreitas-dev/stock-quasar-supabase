import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth'
import useApi from 'src/composables/UseApi'

const user = ref(null)

export default function useAuthUser () {
  const auth = getAuth()
  const { create, getById } = useApi()

  const login = async ({ email, password }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password)
      const userLogged = userCredentials.user

      // if (!userLogged.emailVerified) {
      //   throw new Error('Usuário ainda não confirmou o e-mail')
      // }
      const userDb = await getById('users', userLogged.uid)
      user.value = userDb
      user.value.uuid = userLogged.uid
    } catch (error) {
      let message = 'Ocorreu um erro durante o login. '
      switch (error.code) {
        case 'auth/invalid-credential':
          message = message + 'E-mail e/ou senha incorreta'
          break
        case 'auth/internal-error':
          message = message + 'Ocorreu um erro interno no servidor'
          break
        case 'auth/invalid-argument':
          message = message + 'Valores informados são inválidos'
          break
        case 'auth/user-not-found':
          message = message + 'Usuário não encontrado'
          break
        default:
          message = message + error.message
      }
      throw new Error(message)
    }
  }

  const logout = async () => {
    user.value.vaue = null
  }

  const isLoggedIn = () => {
    return !!user.value
  }

  const register = async ({ email, password, name }) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = {
        name
      }
      await create('users', userCredentials.user.uid, newUser)
      await sendEmailVerification(auth.currentUser)
    } catch (error) {
      console.log(error.code)
      let message = 'Ocorreu um erro durante o cadastro. '
      switch (error.code) {
        case 'auth/uid-already-exists':
          message = message + 'Uid atribuído ao novo usuário já existe'
          break
        case 'auth/invalid-password':
          message = message + 'O valor fornecido para a senha é inválido'
          break
        case 'auth/email-already-exists':
          message = message + 'O e-mail fornecido já existe'
          break
        case 'auth/internal-error':
          message = message + 'Ocorreu um erro interno no servidor'
          break
        case 'auth/invalid-argument':
          message = message + 'Valores informados são inválidos'
          break
        case 'auth/email-already-in-use':
          message = message + 'O e-mail fornecido já está em uso'
          break
        default:
          message = message + error.message
      }
      throw new Error(message)
    }
  }

  const sendPasswordRestEmail = async (email) => {
    try {
      sendPasswordResetEmail(auth, email)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  return {
    user,
    login,
    logout,
    isLoggedIn,
    register,
    sendPasswordRestEmail
  }
}
