import axios from 'axios'
import type { user } from '../types/userType'
import type { todo } from '../types/todoType'
import { useAuthStore } from '@/stores/auth'

const API_URL = 'http://localhost:3000'
const API_URL_LOGIN = '/login'
const API_URL_REGISTER = '/register'
const API_URL_TODO = '/todo'

const api = class Api {
  static async getTodoList() {
    const response = await axios.get(API_URL + API_URL_TODO)
    return response.data
  }

  static async loadAuthWithToken() {
    const authStore = useAuthStore()
    axios.defaults.headers.common['Authorization'] = authStore.token
  }

  static async createTodo(data: todo) {
    const response = await axios.post(API_URL + API_URL_TODO, data)
    return response.data
  }
  static async postLogin(data: user) {
    const response = await axios.post(API_URL + API_URL_LOGIN, data)
    const authStore = useAuthStore()
    if (response.data.token) authStore.login(response.data.token)
    return true
  }
  static async postRegister(data: user) {
    const response = await axios.post(API_URL + API_URL_REGISTER, data)
    return response.data
  }

  static async deleteTodoList(id: number) {
    const response = await axios.delete(API_URL + API_URL_TODO + '/' + id)
    return response.data
  }
  static async closeTodoList (id: number, data: todo) {
    const response = await axios.put(API_URL + API_URL_TODO + '/' + id, data)
    return response.data
  }
}
export default api
