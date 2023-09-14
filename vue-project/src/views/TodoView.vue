<template>
  <div>
    <div>
      <JokeWarnings />
    </div>

    <TodoList />

    <button @click="logout">logout</button>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import JokeWarnings from '@/components/JokeWidget.vue'
import TodoList from '@/components/todo/TodoList.vue'

const authStore = useAuthStore()
const logout = () => {
  authStore.logout()
  router.push('login')
}
</script>

<style scoped></style>
