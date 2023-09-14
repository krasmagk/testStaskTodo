import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import api from '@/utils/api'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
api.loadAuthWithToken()

app.mount('#app')
