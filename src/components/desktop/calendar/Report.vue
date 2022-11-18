<script setup lang="ts">
import { getPackedSettings } from 'http2'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios, { AxiosInstance } from 'axios'
import {
	Button,
	Toolbar,
	ToolbarItem,
	ToolbarSpacer,
} from '@progress/kendo-vue-buttons'
import { Checkbox, Input, RadioGroup } from '@progress/kendo-vue-inputs'
import { DropDownList } from '@progress/kendo-vue-dropdowns'
import { number } from '@intlify/core-base'
import MultiSelect from '~/components/shared/MultiSelect.vue'
import { useGlobalStore } from '~/stores/globals'
import DesktopReportService from '~/services/desktop-report'
import ResponseData from '~/types/ResponseData'

const emit = defineEmits(['setDialogMessage'])
const globalStore = useGlobalStore()
const route = useRoute()
const key = ref('')

const ErrorMessage = ref('')

const showErrorMessage = (err) => {
	emit('setDialogMessage', err, 'Error Message')
}

const LocationID = ref()
const locationList = ref([])
const reportTitle = ref('')
const reportTitlePlacement = ref('2')
const groupBySettingList = ref([])
const includeOptionsList = ref([])
const startMonth = ref('')
const endMonth = ref('')
const startYear = ref((new Date()).getFullYear())
const endYear = ref((new Date()).getFullYear())
const groupBySelected = ref('1')

const years = ref([])

const placementOptions = [
	{
		label: 'Left',
		value: '0',
	},
	{
		label: 'Center',
		value: '1',
	},
	{
		label: 'right',
		value: '2',
	},
]
const months = ['January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December']

function getReportForm() {
	DesktopReportService.getReportForm()
		.then((response: ResponseData) => {
			if (response.data.success) {
				locationList.value = response.data.Report.LocationList.map((el) => {
					return {
						...el,
					}
				})
				reportTitle.value = response.data.Report.ReportTitle
				reportTitlePlacement.value = response.data.Report.ReportTitlePlacement
				groupBySettingList.value = response.data.Report.GroupBySettingList.map((el) => {
					return {
						...el, label: el.Description, value: el.Code,
					}
				})
				includeOptionsList.value = response.data.Report.IncludeOptionsList.map((el) => {
					return {
						...el,
					}
				})
				groupBySelected.value = groupBySettingList.value.find(x => x.IsSelected.toUpperCase() === 'TRUE')?.Code
				LocationID.value = locationList.value.find(x => x.IsSelected)
			}
			else {
				showErrorMessage(response.data.ErrorMessage)
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}

onMounted(() => {
	getReportForm()
	startMonth.value = months[(new Date()).getMonth()]
	endMonth.value = months[(new Date()).getMonth()]
	getYears()
})
function IsDiabled(code) {
	return groupBySelected.value !== '5' && (code === 'include_schedule_comment' || code === 'include_status')
}
function getYears() {
	const thisYear = (new Date()).getFullYear()
	years.value = []

	for (let i = thisYear - 5; i <= thisYear + 5; i++) {
		years.value.push(i)
	}
}
function settingChecked(code) {
	const item = includeOptionsList.value.find(x => x.Code === code)

	return (item && item.IsSelected.toUpperCase() === 'TRUE')
}

function checkBoxChanged(event, code) {
	if (!includeOptionsList.value.find(x => x.Code === code)) {
		const newSetting = { Code: code, IsSelected: event.value }
		includeOptionsList.value.push(newSetting)
	} else {
		if (event.value)
			includeOptionsList.value.find(x => x.Code === code).IsSelected = 'True'
		else
			includeOptionsList.value.find(x => x.Code === code).IsSelected = 'False'
	}
}

function handleSubmit() {
	const start = new Date(startYear.value, months.indexOf(startMonth.value), 1)
	const end = new Date(endYear.value, months.indexOf(endMonth.value), 1)
	if (start > end) {
		showErrorMessage('End Date must be greater than Start Date.')
	} else if (end > new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())) {
		showErrorMessage('Date range must be less than one year.')
	} else if (includeOptionsList.value.slice(-4).filter(x => x.IsSelected.toUpperCase() === 'TRUE').length === 0) {
		showErrorMessage('Please select to include at least one display item: tasks/holidays/appts/Events/EventTasks.')
	} else {
		let data: { Name: string; Value: string }[]
		data = includeOptionsList.value.map((el) => {
			return {
				...el, Name: el.Code, Value: el.IsSelected,
			}
		})
		data.push({ Name: 'LocationID', Value: LocationID.value.Code })
		data.push({ Name: 'ReportTitle', Value: reportTitle.value })
		data.push({ Name: 'ReportTitlePlacement', Value: reportTitlePlacement.value })
		data.push({ Name: 'GroupBy', Value: groupBySelected.value })
		data.push({ Name: 'StartMonth', Value: months.indexOf(startMonth.value) })
		data.push({ Name: 'StartYear', Value: startYear.value })
		data.push({ Name: 'EndMonth', Value: months.indexOf(endMonth.value) })
		data.push({ Name: 'EndYear', Value: endYear.value })
		console.log(data)
		DesktopReportService.getReport(JSON.stringify(data))
			.then((response: ResponseData) => {
				if (response.data.success === true) {
					let bytes = new Uint8Array(response.data.FileContent.FileContents)
					const blob = new Blob([bytes], { type: 'application/vnd.ms-excel' })
					const url = window.URL.createObjectURL(blob)
					const link = document.createElement('a')
					link.href = url
					link.setAttribute('download', response.data.FileContent.FileDownloadName)
					document.body.appendChild(link)
					link.click()
				} else if (response.data.ErrorMessage && response.data.ErrorMessage !== '') {
					showErrorMessage(response.data.ErrorMessage)
				} else {
					showErrorMessage('Something went wrong')
				}
			})
			.catch((e: Error) => {
				console.log('ERROR:  ', e)
			})
	}
}
</script>

<template>
	<form @submit.prevent="handleSubmit">
		<fieldset>
			<div id="availabilityComponent" class="">
				<div id="toolbar" class="row">
					<Toolbar>
						<ToolbarItem>
							<Button
								type="submit"
								theme-color="primary"
								style="width: 90px"
							>
								View Report
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
				<div class="row py-3">
					<div class="col-sm-6 ps-md-0 pe-md-2">
						<div class="border">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Location ID</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-center">
								<div class="col-12">
									<div class="row py-2 ps-3">
										<label for="Office" class="col-auto col-form-label text-right">Location
											ID:</label>
										<div class="col-md-9 text-left">
											<DropDownList
												v-model="LocationID"
												:data-items="locationList"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<div class="border">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Report title and placement</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-center">
								<div class="col-12">
									<div class="row py-2 ps-3">
										<label for="Office" class="col-auto col-form-label text-right">Title:</label>
										<div class="col-auto">
											<Input
												v-model="reportTitle"
												:style="{ width: '500px' }"
												class="form-control"
											/>
										</div>
										<div class="col-auto">
											<div class="btn-group " role="group">
												<Input
													id="btnradio1"
													v-model="reportTitlePlacement"
													:value="placementOptions[0].value"
													type="radio"
													class="btn-check"
													name="btnradio"
													autocomplete="off"
													:checked="reportTitlePlacement === '0'"
												>
													<label class="btn btn-outline-secondary" for="btnradio1">{{
														placementOptions[0].label }}</label>
													<Input
														id="btnradio2"
														v-model="reportTitlePlacement"
														:value="placementOptions[1].value"
														type="radio"
														class="btn-check"
														name="btnradio"
														autocomplete="off"
														:checked="reportTitlePlacement === '1'"
													>
														<label class="btn btn-outline-secondary" for="btnradio2">{{
															placementOptions[1].label }}</label>
														<Input
															id="btnradio3"
															v-model="reportTitlePlacement"
															:value="placementOptions[2].value"
															type="radio"
															class="btn-check"
															name="btnradio"
															autocomplete="off"
															:checked="reportTitlePlacement === '2'"
														/>
														<label class="btn btn-outline-secondary" for="btnradio3">{{
															placementOptions[2].label }}</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<div class="border">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Month/Year</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-center">
								<div class="col-12">
									<div class="row py-2 ps-3">
										<label class="col-auto col-form-label">Start Month:</label>
										<div class="col-auto">
											<DropDownList
												v-model="startMonth"
												style="width: 110px"
												:data-items="months"
												class="form-control"
											/>
										</div>
										<label class="col-auto col-form-label">Year:</label>
										<div class="col-auto">
											<DropDownList
												v-model="startYear"
												:data-items="years"
												class="form-control"
											/>
										</div>
										<div class="col-auto ps-4 pe-4" style="padding-top:10px;">
											<div class="vr" style="height:15px" />
										</div>
										<label class="col-auto col-form-label">End Month:</label>
										<div class="col-auto">
											<DropDownList
												v-model="endMonth"
												style="width: 110px"
												:data-items="months"
												class="form-control"
											/>
										</div>
										<label class="col-auto col-form-label">Year:</label>
										<div class="col-auto">
											<DropDownList
												v-model="endYear"
												:data-items="years"
												class="form-control"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-3 ps-md-0 pe-md-2">
						<div class="border" style="min-height: 320px;">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Group by</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-left ps-4 pe-1">
								<div class="col-md-3">
									<div class="row pb-1">
										<div class="col-auto">
											<RadioGroup
												v-model="groupBySelected"
												:data-items="groupBySettingList"
												@change="groupByChanged"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-3 ps-md-0 pe-md-1">
						<div class="border" style="min-height: 320px;">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Include Options</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-left ps-4 pe-1">
								<div class="col-12">
									<div
										v-for="item in includeOptionsList"
										:key="item.Code"
										class="row py-1"
									>
										<div class="col-auto">
											<Checkbox
												:disabled="IsDiabled(item.Code)"
												:checked="settingChecked(item.Code)"
												@change="checkBoxChanged($event, item.Code)"
											/>
											<label class="form-check-label">{{ item.Description }}</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	</form>
</template>

<style scoped>
.k-picker {
	background-color: unset;
}
</style>

<style>
.k-checkbox {
	vertical-align: middle !important;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
