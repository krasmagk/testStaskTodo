<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <InputComponents
        label="Email:"
        type="email"
        name="email"
        :value="email"
        id="email"
        @update:value="email = $event"
        :error="!isValidEmail ? 'Введите корректный email' : ''"
        placeholder="example@example.com"
        required
      />

      <InputComponents
        label="Пароль:"
        type="password"
        name="password"
        :value="password"
        id="password"
        @update:value="password = $event"
        placeholder="password"
        :error="!isValidPassword ? 'Пароль должен быть от 8 до 20 символов' : ''"
        required
      />
      <p>{{ error }}</p>
      <button :disabled="disabled" type="submit">Войти</button>
    </form>
  </div>
  <router-link to="/register">Регистрация</router-link>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import router from '@/router'
import InputComponents from '../UI/InputComponents.vue'
import { debounce } from 'lodash'
import api from '@/utils/api'
const email = ref('')
const password = ref('')

const disabled = computed(() => {
  return !isValidEmail.value || !isValidPassword.value
})
watch([email, password], () => {
  console.log('email: ', email.value)
  console.log('password', password.value)
})

const isValidEmail = ref(false)

const isValidPassword = ref(false)
const debouncedCheckEmail = debounce(() => {
  if (email.value.length >= 5) {
    isValidEmail.value = true
  } else {
    isValidEmail.value = false
  }
}, 200)
const debouncedCheckPassword = debounce(() => {
  if (password.value.length >= 8 && password.value.length <= 20) {
    isValidPassword.value = true
  } else {
    isValidPassword.value = false
  }
}, 200)
watch(password, debouncedCheckPassword)
watch(email, debouncedCheckEmail)
const error = ref('')
const login = () => {
  // Реализуйте логику авторизации
  api.postLogin({ email: email.value, password: password.value })
    .then((res) => {  
      if(res)
      router.push({ name: 'todo' })
    })
    .catch((err) => {
      console.log(err)
      error.value = err.response.data.message
    })
}
</script>
