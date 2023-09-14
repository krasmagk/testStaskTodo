<template>
  <div>
    <h1>Registration</h1>
    <form @submit.prevent="register">
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
  <router-link to="/login">login</router-link>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import InputComponents from '../UI/InputComponents.vue'
import { debounce } from 'lodash'
import router from '@/router'
import api from '@/utils/api'

const email = ref('')
const password = ref('')

const disabled = computed(() => {
  return !isValidEmail.value || !isValidPassword.value
})
const isValidEmail = ref(true)

const isValidPassword = ref(true)
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
const register = () => {
  api
    .postRegister({ email: email.value, password: password.value })
    .then(() => {
      api
        .postLogin({ email: email.value, password: password.value })
        .then((res) => {
          if (res) router.push({ name: 'todo' })
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err)
      error.value = err.response.data.message
    })
}
</script>
