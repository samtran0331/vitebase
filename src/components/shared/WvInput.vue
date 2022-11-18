<template>
	<div class="input-group">
		<label
			v-if="labelText"
			for="inputTextBox"
			class="form-label"
		>{{ labelText }}</label>
		<input
			id="inputTextBox"
			:value="modelValue"
			v-bind="$attrs"
			class="form-control"
			aria-describedby="smallHelp"
		>
		<small
			v-if="helpText"
			id="inputHelp"
			class="form-text text-muted"
		>{{ helpText }}</small>
	</div>
</template>
<script setup lang="ts">
const props = defineProps<{
	labelText: String
	placeholderText: String | undefined
	helpText: String | undefined
    modelValue: String | undefined
}>()
const emit = defineEmits(['update:modelValue'])
</script>
<style scoped>
</style>