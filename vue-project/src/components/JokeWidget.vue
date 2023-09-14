<template>
  <div class="joke">
    <h2>Chuck Norris Joke</h2>
    <p>{{ joke }}</p>
    <p v-if="error">{{ error }}</p>
    <button @click="getJoke">Получить новую шутку</button>
    <button @click="reset">Сбросить</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const joke = ref('')
const error = ref('')
const getJoke = () => {
  axios
    .get('https://api.chucknorris.io/jokes/random')
    .then((res) => {
      joke.value = res.data.value
    })
    .catch((err) => {
      console.log(err)
      error.value = err.response.data.message
    })
}
const reset = () => {
  joke.value = ''
}
onMounted(() => {
  getJoke()
})
</script>
<style scope>
.joke {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background-color: #ffffff;
  border: 1px solid #000000;
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

button {
}
</style>
