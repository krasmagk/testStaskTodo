<template>
  <div class="form__input">
    <label v-if="label" :for="id" class="form__label">{{ label }}</label>
    <input
      class="input"
      :type="type"
      :value="value"
      :disabled="disabled"
      :id="id"
      :name="name"
      @input="updateValue"
      @change="updateValue"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
      autocomplete="off"
      :placeholder="placeholder"
      :required="required"
    />
    <p v-if="error" class="form__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
    validate: (value: string) => ['text', 'email', 'password', 'url', 'search'].includes(value)
  },
  label: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String
  },
  id: {
    type: String
  },
  name: {
    type: String
  },
  placeholder: {
    type: String
  },
  required: {
    type: Boolean
  }
})
const emit = defineEmits(['update:value', 'blur', 'focus'])
const updateValue = (event: Event) => {
  emit('update:value', (event.target as HTMLInputElement).value)
}
</script>
