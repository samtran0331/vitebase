<template>
	<select
		v-model="selectedItems"
		:size="props.listSize"
		class="form-control"
		multiple
		@change="handleSelectionChange"
	>
		<option
			v-for="option in props.options"
			:key="option.Code"
			:value="option.Code"
		>
			{{ option.Description }}
		</option>
	</select>
</template>
<script setup lang="ts">

const props = defineProps<{
    options: []
    listSize: string
    modelValue: []
}>()
const selectedItems = ref([])
const emit = defineEmits(['selectionChanged'])
const handleSelectionChange = (e) => {
  emit('selectionChanged', selectedItems.value)
}
watch(() => props.modelValue, (oldVal, newVal) => {
	selectedItems.value = oldVal
    })
</script>
<style scoped>
</style>