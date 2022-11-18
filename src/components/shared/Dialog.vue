<template>
	<window
		v-if="visible"
		:title="title"
		:initial-height="height"
		@close="handleClose"
		@move="handleMove"
		@resize="handleResize"
		@stagechange="handleStageChange"
	/>
</template>
<script setup lang="ts">
import { Window } from '@progress/kendo-vue-dialogs'
const visible = ref(false)
const title = ref('Hello')
const height = ref(350)

function handleClose() {
	console.log('handleClose')
}
function handleMove() {
	console.log('handleMove')
}
function handleResize() {
	console.log('handleResize')
}
function handleStageChange() {
	console.log('handleStageChange')
}
</script>
<style scoped>
</style>
