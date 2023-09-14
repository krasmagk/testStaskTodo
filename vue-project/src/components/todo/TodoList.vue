<template>
    <form @submit.prevent="createTodo">
      <InputComponents
        label="text todo:"
        type="text"
        name="text"
        :value="todoReactive.task"
        id="todo"
        @update:value="todoReactive.task = $event"
        placeholder="todo"
        :error="!isValidTodo ? 'Todo должен быть от 8 до 200 символов' : ''"
        required
      />
      <button type="submit">createTodo</button>
    </form>
  <TodoItem v-for="(item, index) in todoList" :key="index" :task="item.task" :index="index" :close="item.close" />
</template>

<script lang="ts" setup>
import TodoItem from './TodoItem.vue'
import { ref, onMounted, reactive, watch } from 'vue'
import type { todo } from '@/types/todoType'
import api from '@/utils/api'
import InputComponents from '@/components/UI/InputComponents.vue'
import { debounce } from 'lodash'

const todoReactive = reactive({
  task: '',
  close: false
})
const createTodo = () => {
    todoList.value.push(todoReactive)
    api.createTodo(todoReactive)
}
const isValidTodo = ref(true)
const debouncedCheckTodo = debounce(() => {
  if (todoReactive.task.length >= 8 && todoReactive.task.length <= 200) {
    isValidTodo.value = true
  } else {
    isValidTodo.value = false
  }
}, 200)
watch(todoReactive, debouncedCheckTodo)


const todoList = ref()
const getTodoList = async () => {
    const response = await api.getTodoList();
    const filteredList = response.filter((item: todo) => item.task !== undefined);
    todoList.value = filteredList;
}
onMounted(() => {
  getTodoList()
})
</script>
