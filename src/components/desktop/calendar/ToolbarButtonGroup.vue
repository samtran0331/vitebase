<script setup lang="ts">
import { PropType, markRaw, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Button,
  ButtonGroup,
} from '@progress/kendo-vue-buttons'
import { TabStrip } from '@progress/kendo-vue-layout'
import { useGlobalStore } from '~/stores/globals'
const props = defineProps<{
  currentTab: string
  tabs: {}
}>()
const emit = defineEmits(['tabChanged'])
// import DefaultLayout from '@/layouts/DefaultLayout.vue'
const route = useRoute()
const store = useGlobalStore()

const handleTabSelectionChange = (tab) => {
  emit('tabChanged', tab)
}
onMounted(() => {
})
</script>

<template>
	<ButtonGroup selection="single">
		<Button
			v-for="(_, tab) in props.tabs"
			:key="tab"
			class="tab-button "
			:class="[{ active: props.currentTab === tab }]"
			@click="handleTabSelectionChange(tab)"
		>
			{{ tab }}
		</Button>
	</ButtonGroup>
</template>

<style scoped>
.active {
    border-bottom-width: 1px !important;
    border-style: solid !important;
    border-bottom-color: #0d6efd !important;
	font-weight:600;
	color: #0d6efd ;
}
</style>