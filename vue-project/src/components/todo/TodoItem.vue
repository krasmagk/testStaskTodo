<template>
  <div v-if="!isDelete">
    <h3 :class="{close: isClose}">{{ task }}</h3>
    <button @click="closeTodo">close</button>
    <button @click="deleteTodo">delete</button>
  </div>
</template>

<script lang="ts" setup>
import api from '@/utils/api';
import { defineProps, ref } from 'vue';
const props = defineProps({
  task: {
    type: String,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  close: {
    type: Boolean,
    required: true
  }
})
const isClose = ref(props.close)
const isDelete = ref(false)

const closeTodo = () => {
  const body = {
    task: props.task,
    close: true
  }
  api.closeTodoList(props.index, body).then(() => isClose.value = true)
}
const deleteTodo = () => {
  api.deleteTodoList(props.index).then(() => isDelete.value = true)
}
</script>

<style  scoped>
h3{
    font-size: 20px;
    margin-bottom: 10px;
    
}
h3.close {
    text-decoration: line-through;
	text-decoration-color: red;
}
</style>
