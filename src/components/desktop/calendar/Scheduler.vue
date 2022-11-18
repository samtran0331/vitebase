<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Scheduler, SchedulerItem } from '@progress/kendo-vue-scheduler'
import {
  Button,
  ButtonGroup,
  DropDownButton,
  SplitButton,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
  ToolbarSpacer,
} from '@progress/kendo-vue-buttons'
import { Tooltip } from '@progress/kendo-vue-tooltip'
import { Menu } from '@progress/kendo-vue-layout'
import { Popup } from '@progress/kendo-vue-popup'
import { useGlobalStore } from '~/stores/globals'
import DesktopCalendarService from '~/services/desktop-calendar'
import ResponseData from '~/types/ResponseData'
import helper from '~/utils/calendar-helper'
import CalendarTypes from '~/utils/calendar-types'
const props = defineProps<{
  currentTab: string
  tabs: {}
}>()
const emit = defineEmits(['openNewCalAct'])
const globalStore = useGlobalStore()
const route = useRoute()
const key = ref('')
const views = ref([
  { name: 'month', title: 'Month', selected: true },
  { name: 'week', title: 'Week' },
  { name: 'workweek', title: 'Work week' },
  { name: 'day', title: 'Day' },
  { name: 'agenda', title: 'Agenda' },
])
const schedulerData = ref([])
const calItems = ref([])
const displayDate = ref(new Date())
const modelFields = ref({
    id: 'ID',
    title: 'UserDisplay',
    start: 'StartDate',
    end: 'EndDate',
})
const employeeCode = ref('')
// const startDate = ref(new Date())
const startDate = ref('')
const newActivityText = ref('New Activity')
const goToTodayText = ref('Go To Today')
const currentContextOffset = ref({
	left: 0,
	top: 0,
})
const showContext = ref(false)
const contextItems = ref([
	{ text: newActivityText.value },
	{ text: goToTodayText.value },
])
const includeTypeButton = ref(null)
const includeTypesPopupOffset = ref({
	left: 0,
	top: 0,
})
const showIncludeTypesPopup = ref(false)
const showIncludeTypesPopupItems = ref([
	{ text: newActivityText.value },
	{ text: goToTodayText.value },
])
const includeTasks = ref(true)
const includeAssignments = ref(true)
const includeHolidays = ref(true)
const includeAppointments = ref(true)

const dispatchRefresh = () => {
	console.log('dispatchRefresh on Scheduler.vue')
	getCalendar()
}
defineExpose({ key, dispatchRefresh })

function emitOpenNewActivityWindow() {
    emit('openNewCalAct')
}
function handleContextMenu(e) {
	e.preventDefault()
	currentContextOffset.value = {
		left: e.clientX,
		top: e.clientY,
	}
	showContext.value = true
}
function onContextMenuSelect(e) {
	if (e.item.text === newActivityText.value) {
		console.log('new')
	} else if (e.item.text === goToTodayText.value) {
		console.log('today')
	}
}
function getCalendar() {
	// console.log('getCalendar on Scheduler')
	DesktopCalendarService.getCalendar(employeeCode.value, startDate.value)
		.then((response: ResponseData) => {
		if (response.data.Success === true) {
			schedulerData.value = response.data.CalendarItems.map((el) => {
			return {
				...el,
				StartDate: new Date(el.StartISO),
				EndDate: new Date(el.EndISO),
			}
			})
		} else {
			if (response.data.ErrorMessage && response.data.ErrorMessage !== '') {
				// eslint-disable-next-line no-alert
				alert(response.data.ErrorMessage)
			}
		}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}
function initComponent(initData: any) {
	console.log('initData', initData, key.value)
}
function includeClick() {
	console.log('includeClick')
	showIncludeTypesPopup.value = !showIncludeTypesPopup.value
}
function dueDateViewClick() {
	console.log('dueDateViewClick')
}
function icsClick() {
	console.log('icsClick')
}
function exportExcelClick() {
	console.log('exportExcelClick')
}
function printClick() {
	console.log('printClick')
}
function refreshClick() {
	console.log('refreshClick')
	getCalendar()
}
function bookmarkClick() {
	console.log('bookmarkClick')
}

onMounted(() => {
  // if (route.query && route.query.dl) {
  //   key.value = route.query.dl.toString()
  //   localStorage.setItem('conn', key.value)
  //   getCalendar()
  // }
    document.addEventListener(
      'click',
		() => {
			showContext.value = false
		},
    )
	if (route.query) {
		if (route.query.emp) {
			employeeCode.value = route.query.emp.toString()
		}
		if (route.query.sd) {
			// startDate.value = kendo.parseDate(route.query.sd.toString())
			startDate.value = route.query.sd.toString()
		}
		getCalendar()
	}
})
</script>

<template>
	<div class="container-fluid">
		<div id="toolbar">
			<Toolbar>
				<ToolbarItem>
					<Button
						class="k-button wv-icon-button wv-add-new"
						title="Add a new calendar item"
						@click="emitOpenNewActivityWindow"
					>
						<span class="wvi wvi-navigate-plus" />
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						ref="includeTypeButton"
						title="Include types"
						@click="includeClick"
					>
						Include
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						title="Switch to Due date view"
						@click="dueDateViewClick"
					>
						Due Date View
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						title="ICS"
						@click="icsClick"
					>
						ICS
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						class="wv-icon-button"
						title="Export to Excel"
						@click="exportExcelClick"
					>
						<span class="wvi wvi-excel-logo" />
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						class="wv-icon-button"
						title="Print"
						@click="printClick"
					>
						<span class="wvi wvi-printer" />
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						class="wv-icon-button"
						title="Refresh"
						@click="refreshClick"
					>
						<span class="wvi wvi-refresh" />
					</Button>
				</ToolbarItem>
				<ToolbarItem>
					<Button
						class="wv-icon-button"
						title="Bookmark"
						@click="bookmarkClick"
					>
						<span class="wvi wvi-book-bookmark2" />
					</Button>
				</ToolbarItem>
				<ToolbarSpacer />
				<ToolbarItem>
					<ToolbarButtonGroup
						:tabs="tabs"
						:current-tab="currentTab"
						v-bind="$attrs"
					/>
				</ToolbarItem>
			</Toolbar>
		</div>
		<div class="row">
			<div class="col-1" style="width:55px;">
				<Tooltip
					v-for="(type, index) in CalendarTypes"
					:key="type.id"
					:open-delay="100"
					position="right"
					anchor-element="target"
				>
					<div
						class="legend-chicklet"
						:class="type.css"
						:title="type.text"
					/>
				</Tooltip>
			</div>
			<div class="col">
				<div class="wrapper">
					<div id="">
						<Scheduler
							:style="{ height: '700px' }"
							:data-items="schedulerData"
							:default-date="displayDate"
							:views="views"
							:model-fields="modelFields"
							item="itemRender"
							@contextmenu="handleContextMenu"
						>
							<template #itemRender="{ props }">
								<SchedulerItem
									v-bind="props"
									:item-style="{
										backgroundColor: helper.setSchedulerItemColor(props.dataItem.NonTaskType),
									}"
								>
									<div class="k-event-template">
										{{ props.title }}
									</div>
								</SchedulerItem>
							</template>
						</Scheduler>
						<Popup
							:show="showContext"
							:offset="currentContextOffset"
						>
							<Menu
								:items="contextItems"
								:vertical="true"
								:style="{ display: 'inline-block' }"
								@select="onContextMenuSelect"
							/>
						</Popup>
						<Popup
							anchor="includeTypeButton"
							:show="showIncludeTypesPopup"
							:offset="includeTypesPopupOffset"
						>
							<div class="col-12">
								<div class="form-check">
									<label class="form-check-label" for="includeTasks"> Tasks </label>
									<input
										v-model="includeTasks"
										name="includeTasks"
										class="form-check-input"
										type="checkbox"
									/>
								</div>
							</div>
						</Popup>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  /* display: flex; */
  margin: 0;
}
.right-container {
  width: 52px;
  margin-right: 8px;
}
.calendar-container {
  flex: 1;
  z-index: 0;
  position: relative;
}
.legend-chicklet {
  border-radius: 4px;
  height: 24px;
  width: 24px;
  margin: 0px auto 10px auto;
}
.cal-task-active {
  background-color: #198754;
}
.cal-task-pending {
  background-color: #6c757d;
}
.cal-task {
  background-color: #198754;
}
.cal-to-do {
  background-color: #664d03;
}
.cal-meeting {
  background-color: #08A2C0;
}
.cal-call {
  background-color: #055160;
}
.cal-appointment {
  background-color: #077990;
}
.cal-holiday {
  background-color: #ca6510;
}
.cal-event {
  background-color: #801F4F;
}
.cal-event-task {
  background-color: #AB286A;
}
.cal-email {
  background-color: #CC9A07;
}
.cal-assignment {
  background-color: #59359A;
}
.cal-office-assignment {
  background-color: #432874;
}
#toolbar {
  margin-bottom: 10px;
}
#vertical-toolbar {
  width: 48px;
  border: 1px solid #DEE2E6;
  height: 100%;
  background-color: #F8F9FA;
  padding: 12px 0px 10px 0px;
  /* transition: width 0.5s;
  -webkit-transition: width 0.5s; */
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>