<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
	Button,
	Toolbar,
	ToolbarItem,
	ToolbarSpacer,
} from '@progress/kendo-vue-buttons'
import { Grid } from '@progress/kendo-vue-grid'
import { DatePicker } from '@progress/kendo-vue-dateinputs'
import { MultiSelect } from '@progress/kendo-vue-dropdowns'
import { Input } from '@progress/kendo-vue-inputs'
import { Loader } from '@progress/kendo-vue-indicators'
import DesktopAllocationService from '~/services/desktop-allocation'
import ResponseData from '~/types/ResponseData'

const emit = defineEmits(['setDialogMessage'])
const StartDate = ref('')
const EndDate = ref('')
const EmployeeList = ref([])

const showGrid = ref(false)
const showDeptGrid = ref(false)
const showEmpGrid = ref(false)

const AllocationHeader = ref('')
const loader = ref(false)
const departmentLoader = ref(false)
const employeeLoader = ref(false)

const AllocationData = ref([])
const AllocationDeptData = ref([])
const AllocationEmpData = ref([])

const departmentDiv = ref(null)
const employeeDiv = ref(null)

const selectedSummary = ref('')
const selectedEmployee = ref([])
const selectedEmployeeCode = ref('')
const selectedEmployeeName = ref('')
const selectedField = 'selected'

const EmployeeImage = ref('')
const AssignmentLoaded = ref(false)
const AssignmentDiv = ref(null)

const aggregates = ref<any[]>([])

const summaryLevels = [
	{
		label: 'Weekly',
		value: '2',
	},
	{
		label: 'Monthly',
		value: '3',
	},
]

const fixedAllocationColumns = [
	{
		field: 'DepartmentCode',
		title: 'DepartmentCode',
		width: '0px',
	},
	{
		field: 'Department',
		title: 'Department',
		width: '150px',
	},
]
const allAllocationColumns = ref<any[]>([])
const fixedAllocationDeptColumns = [
	{
		field: 'EmployeeCode',
		title: 'EmployeeCode',
		width: '0px',
	},
	{
		field: 'Employee',
		title: 'Employee',
		width: '150px',
	},
]
const allAllocationDeptColumns = ref<any[]>([])
const fixedAllocationEmpColumns = [
	{
		field: 'Project',
		title: 'Project',
		width: '200px',
	},
	{
		field: 'ProjectStartDate',
		title: 'Project Start Date',
		format: '{0:dd/MM/yyyy}',
		width: '90px',
	},
	{
		field: 'ProjectEndDate',
		title: 'Project End Date',
		format: '{0:dd/MM/yyyy}',
		width: '90px',
	},
	{
		field: 'Status',
		title: 'Status',
		width: '100px',
	},
	{
		field: 'HoursAssigned',
		title: 'Hours Assigned',
		format: '{0:n2}',
		className: 'allign-right',
		width: '100px',
	},
]
const allAllocationEmpColumns = ref<any[]>([])

const AppointmentHours = ref(0)
const DirectHoursGoalPercent = ref(0)
const HoursAssigned = ref(0)
const HoursOff = ref(0)
const StandardHoursAvailable = ref(0)
const Variance = ref(0)

const showErrorMessage = (err) => {
	emit('setDialogMessage', err, 'Error Message')
}

function getAllocationForm() {
	DesktopAllocationService.getAllocationForm()
		.then((response: ResponseData) => {
			if (response.data.success) {
				StartDate.value = new Date(response.data.Allocation.StartDate)
				EndDate.value = new Date(response.data.Allocation.EndDate)
				EmployeeList.value = response.data.Allocation.EmployeeList.map((el: { Code: string; Description: string }) => {
					return {
						...el,
					}
				})
				selectedEmployee.value.push(response.data.Allocation.EmployeeList[0])
			}
			else {
				showErrorMessage(response.data.ErrorMessage)
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}
function getAllocation() {
	let empCodes = ''
	selectedEmployee.value.forEach((e) => {
		empCodes += `${e.Code},`
	})

	DesktopAllocationService.getAllocation((new Date(StartDate.value)).toLocaleDateString(), (new Date(EndDate.value)).toLocaleDateString(), empCodes, selectedSummary.value)
		.then((response: ResponseData) => {
			if (response.data.Success) {
				allAllocationColumns.value = fixedAllocationColumns.map((el) => {
					return { ...el }
				})
				response.data.DynamicColumnNames.forEach((col) => {
					allAllocationColumns.value.push({ field: col, title: col, width: '60px', format: '{0:n2}', className: 'allign-right' })
				})
				AllocationData.value = JSON.parse(response.data.AllocationList).map((el) => {
					return { ...el, selected: false }
				},
				)
				loader.value = false
			} else {
				showErrorMessage(response.data.ErrorMessage)
				loader.value = false
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
			loader.value = false
		})
}
function getAllocationDept(dept: string) {
	DesktopAllocationService.getAllocationDepartment((new Date(StartDate.value)).toLocaleDateString(), (new Date(EndDate.value)).toLocaleDateString(), selectedEmployee.value.Code, selectedSummary.value, dept)
		.then((response: ResponseData) => {
			if (response.data.Success) {
				allAllocationDeptColumns.value = fixedAllocationDeptColumns.map((el) => {
					return { ...el }
				})
				response.data.DynamicColumnNames.forEach((col) => {
					allAllocationDeptColumns.value.push({ field: col, title: col, width: '60px', format: '{0:n2}%', className: 'allign-right' })
				})
				AllocationDeptData.value = JSON.parse(response.data.AllocationList).map((el) => {
					return { ...el, selected: false }
				},
				)
				// AllocationData.value = orderBy(AllocationData.value, AllocationSort.value)
				departmentLoader.value = false
			} else {
				showErrorMessage(response.data.ErrorMessage)
				departmentLoader.value = false
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
			departmentLoader.value = false
		})
}
function getAllocationEmp(employeeCode: string) {
	DesktopAllocationService.getAllocationEmployee((new Date(StartDate.value)).toLocaleDateString(), (new Date(EndDate.value)).toLocaleDateString(), employeeCode, selectedSummary.value)
		.then((response: ResponseData) => {
			if (response.data.Success) {
				const allocationDetail = JSON.parse(response.data.AllocationEmployeeDetail)
				AppointmentHours.value = allocationDetail.AppointmentHours
				DirectHoursGoalPercent.value = allocationDetail.DirectHoursGoalPercent
				HoursAssigned.value = allocationDetail.HoursAssigned
				HoursOff.value = allocationDetail.HoursOff
				StandardHoursAvailable.value = allocationDetail.StandardHoursAvailable
				Variance.value = allocationDetail.Variance
				EmployeeImage.value = allocationDetail.EmployeeImage

				allAllocationEmpColumns.value = fixedAllocationEmpColumns.map((el) => {
					return { ...el }
				})
				response.data.DynamicColumnNames.forEach((col) => {
					allAllocationEmpColumns.value.push({ field: col, title: col, width: '60px', format: '{0:n2}', className: 'allign-right', footerCell: 'footerTemplate', footerClassName: 'allign-right' })
				})
				AllocationEmpData.value = allocationDetail.AssignmentList.map((el) => {
					return {
						...el,
						selected: false,
						ProjectStartDate: new Date(el.ProjectStartDate),
						ProjectEndDate: new Date(el.ProjectEndDate),
					}
				},
				)
				// AllocationData.value = orderBy(AllocationData.value, AllocationSort.value)
				employeeLoader.value = false
				setTimeout(() => {
					employeeDiv.value.scrollIntoView({ behavior: 'smooth' })
				}, 500)
			} else {
				showErrorMessage(response.data.ErrorMessage)
				employeeLoader.value = false
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
			departmentLoader.value = false
		})
}
onMounted(() => {
	getAllocationForm()
	selectedSummary.value = '2'
})

function handleRefreshSubmit() {
	const dStartDate = new Date(StartDate.value)
	const dEndDate = new Date(EndDate.value)

	if (dEndDate < dStartDate) {
		showErrorMessage('End Date must be greater than Start Date.')
		return
	}
	if (dEndDate > new Date(dStartDate.getFullYear() + 1, dStartDate.getMonth(), dStartDate.getDate())) {
		showErrorMessage('Date range must be less than one year.')
		return
	}

	showGrid.value = true
	loader.value = true
	showDeptGrid.value = false
	showEmpGrid.value = false
	getAllocation()
}

function onAllocationGridRowClick(e) {
	showDeptGrid.value = true
	showEmpGrid.value = false
	departmentLoader.value = true
	AllocationData.value.forEach(e => e.selected = false)
	e.dataItem.selected = true
	getAllocationDept(e.dataItem.DepartmentCode)
}
function onAllocationDeptGridRowClick(e) {
	showDeptGrid.value = true
	showEmpGrid.value = true
	employeeLoader.value = true
	AllocationDeptData.value.forEach(e => e.selected = false)
	e.dataItem.selected = true
	selectedEmployeeName.value = e.dataItem.Employee
	getAllocationEmp(e.dataItem.EmployeeCode)
}
function clearGrid() {
	showGrid.value = false
	showDeptGrid.value = false
	showEmpGrid.value = false
	AllocationData.value = []
	AllocationDeptData.value = []
	AllocationEmpData.value = []
	AppointmentHours.value = 0
	DirectHoursGoalPercent.value = 0
	HoursAssigned.value = 0
	HoursOff.value = 0
	StandardHoursAvailable.value = 0
	Variance.value = 0
	EmployeeImage.value = ''
}
function employeeSelected(e) {
	if (selectedEmployee.value.length === 0)
		selectedEmployee.value.push(EmployeeList.value[0])
	else {
		const values = e.target.value
		const lastEmp = values[values.length - 1]
		const firstEmp = values[0]
		if (lastEmp.Code === '' || firstEmp.Code === '') {
			selectedEmployee.value = []
			selectedEmployee.value.push(lastEmp)
		}
	}
	clearGrid()
}
</script>

<template>
	<form @submit.prevent="handleRefreshSubmit">
		<fieldset :disabled="loader || departmentLoader || employeeLoader">
			<div class="">
				<div id="toolbar" class="row">
					<Toolbar>
						<ToolbarItem>
							<DatePicker
								id="startdate"
								v-model="StartDate"
								:style="{ width: '150px' }"
								class="form-control"
								@change="clearGrid"
							/>
						</ToolbarItem>
						<ToolbarItem>
							-
						</ToolbarItem>
						<ToolbarItem>
							<DatePicker
								id="enddate"
								v-model="EndDate"
								:style="{ width: '150px' }"
								class="form-control"
								@change="clearGrid"
							/>
						</ToolbarItem>
						<ToolbarItem>
							Employee
						</ToolbarItem>
						<ToolbarItem>
							<MultiSelect
								v-model="selectedEmployee"
								:style="{ width: '230px' }"
								:data-items="EmployeeList"
								text-field="Description"
								data-item-key="Code"
								class="form-control"
								:disabled="EmployeeList.length === 1"
								@change="employeeSelected"
							/>
						</ToolbarItem>
						<ToolbarItem>
							<Button type="submit" theme-color="primary">
								Refresh
							</Button>
						</ToolbarItem>
						<ToolbarItem>
							<div class="btn-group" role="group">
								<Input
									id="btnradio1"
									v-model="selectedSummary"
									:value="summaryLevels[0].value"
									type="radio"
									class="btn-check"
									name="btnradio"
									autocomplete="off"
									:checked="selectedSummary === '2'"
									@change="clearGrid"
								>
									<label class="btn btn-outline-secondary" for="btnradio1">{{ summaryLevels[0].label
									}}</label>
									<Input
										id="btnradio2"
										v-model="selectedSummary"
										:value="summaryLevels[1].value"
										type="radio"
										class="btn-check"
										name="btnradio"
										autocomplete="off"
										:checked="selectedSummary === '3'"
										@change="clearGrid"
									>
										<label class="btn btn-outline-secondary" for="btnradio2">{{ summaryLevels[1].label
										}}</label>
							</div>
						</ToolbarItem>
						<ToolbarItem />
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
				<div class="row pt-2">
					<div class="col-12 border text-left">
						<div class="row py-3 px-5 ">
							<div class="col-md-6 text-left">
								<h3>Allocation</h3>
							</div>
							<div class="col-md-6 text-right">
								<b>{{ AllocationHeader }}</b>
							</div>
						</div>
					</div>
				</div>
				<div class="row border border-top-0 py-4" :style="[!showGrid ? { height: '400px' } : { height: 'unset' }]">
					<div id="gridDiv" class="col">
						<div>
							<div v-if="loader">
								<div class="row" style="padding-top:200px;height: 440px;">
									<div class="col-12 text-center align-middle">
										<Loader size="large" type="infinite-spinner" />
									</div>
								</div>
							</div>
							<div v-if="showGrid && !loader">
								<div class="row">
									<div class="col-12 text-left">
										FTE by Department
									</div>
								</div>
								<div class="row">
									<div class="col-xl-12  px-0">
										<Grid
											ref="grid"
											:data-items="AllocationData"
											:columns="allAllocationColumns"
											:selected-field="selectedField"
											@rowclick="onAllocationGridRowClick"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="showDeptGrid" class="">
					<div class="row border border-top-0 py-4">
						<div id="gridDiv" class="col">
							<div>
								<div v-if="departmentLoader">
									<div class="row" style="padding-top:200px;height: 440px;">
										<div class="col-12 text-center align-middle">
											<Loader size="large" type="infinite-spinner" />
										</div>
									</div>
								</div>
								<div v-else>
									<div class="row">
										<div class="col-12 text-left">
											Percent Allocated by Employee
										</div>
									</div>
									<div class="row">
										<div class="col-xl-12  px-0">
											<Grid
												ref="grid"
												:data-items="AllocationDeptData"
												:columns="allAllocationDeptColumns"
												:selected-field="selectedField"
												@rowclick="onAllocationDeptGridRowClick"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="showEmpGrid" class="">
					<div ref="employeeDiv" class="row border border-top-0 py-4">
						<div id="gridDiv" class="col">
							<div>
								<div v-if="employeeLoader">
									<div class="row border-top" style="padding-top:200px;height: 440px;">
										<div class="col-12 text-center align-middle">
											<Loader size="large" type="infinite-spinner" />
										</div>
									</div>
								</div>
								<div v-else>
									<div class="row">
										<div class="col-1">
											<div class="float-end rounded p-1">
												<img :src="EmployeeImage">
											</div>
										</div>
										<div class="col-10 text-left " style="padding-top:10px;">
											<h3>
												Employee Jobs for {{ selectedEmployeeName }} for {{
													StartDate.toLocaleDateString()
												}} through {{
													EndDate.toLocaleDateString()
												}}
											</h3>
										</div>
									</div>
									<div class="row py-2">
										<div class="col-4 text-right">
											Standard Hours Available:
										</div>
										<div class="col-1 text-right">
											{{ StandardHoursAvailable.toFixed(2) }}
										</div>
									</div>
									<div class="row">
										<div class="col-4 text-right">
											Appointment Hours:
										</div>
										<div class="col-1 text-right">
											{{ AppointmentHours.toFixed(2) }}
										</div>
									</div>
									<div class="row">
										<div class="col-4 text-right">
											Hours Off:
										</div>
										<div class="col-1 text-right">
											{{ HoursOff.toFixed(2) }}
										</div>
									</div>
									<div class="row">
										<div class="col-4 text-right">
											Hours Assigned:
										</div>
										<div class="col-1 text-right">
											{{ HoursAssigned.toFixed(2) }}
										</div>
									</div>
									<div class="row">
										<div class="col-4 text-right">
											Variance:
										</div>
										<div
											class="col-1 text-right"
											:style="Variance < 0 ? 'color:red;font-weight:bold' : ''"
										>
											{{ Variance.toFixed(2) }}
										</div>
									</div>
									<div class="row pb-4">
										<div class="col-4 text-right">
											% of Direct Hours Goal:
										</div>
										<div class="col-1 text-right">
											{{ DirectHoursGoalPercent.toFixed(2) }}
										</div>
									</div>
									<div class="row">
										<div class="col-xl-12 px-0">
											<Grid
												ref="grid"
												:data-items="AllocationEmpData"
												:columns="allAllocationEmpColumns"
											>
												<template #footerTemplate="{ props }">
													<span>{{ (AllocationEmpData.reduce((total, arg) => total
														+ arg[props.field], 0)).toFixed(2)
													}}</span>
												</template>
											</Grid>
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
.k-grid-header .k-header>.k-link {
	height: auto;
	white-space: normal;
}

.k-grid .k-grid-header .k-header {
	white-space: normal;
}

.allign-right {
	text-align: right !important;
}

.k-picker {
	background-color: unset;
}

.legend-chicklet {
	border-radius: 4px;
	height: 20px;
	width: 20px;
	margin: 5px auto 10px auto;
}

.text-bold {
	font-weight: bold !important;
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

#sidebar {
	min-width: 650px;
	max-width: 650px;
	transition: all 0.3s;
	padding-left: 15px;
	padding-top: 15px;
	font-size: 0.9em;
	text-align: left;
}

#sidebar.active {
	min-width: 55px;
	max-width: 55px;
}

#sidebar .sidebar-lable {
	padding-left: 0;
}

#sidebar .sidebar-header strong {
	display: none;
}

#sidebar.active .sidebar-lable {
	display: none;
}

#sidebar .sidebar-lable {
	display: block;
}

#sidebar .sidebar-icon-div {
	padding-left: 5px;
	padding-bottom: 10px;
}

#sidebar .sidebar-icon-button {
	padding: 0.375rem 0.5rem;
}

#sidebar .sidebar-icon-button,
#sidebar .sidebar-icon-button:focus {
	box-shadow: unset;
}

.k-master-row td:last-child {
	border-right: 1px solid #dee2e6 !important;
}

.btn-outline-secondary {
	border-color: #e4e7eb;
}

.btn-check:active+.btn,
.btn-check:checked+.btn,
.btn.active,
.btn.show,
.btn:active,
.btn-outline-secondary:hover {
	color: #212529;
	border-color: #c7cdd5;
	background-color: #ced3db;
}
</style>

<style>
.k-grid-table,
.k-grid-header-wrap>table {
	width: 100% !important;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>