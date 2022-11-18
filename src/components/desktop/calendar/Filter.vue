<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
	Button,
	Toolbar,
	ToolbarItem,
	ToolbarSpacer,
} from '@progress/kendo-vue-buttons'
import { Checkbox, Input, RadioButton } from '@progress/kendo-vue-inputs'
import { DropDownList } from '@progress/kendo-vue-dropdowns'
import MultiSelect from '~/components/shared/MultiSelect.vue'
import { useGlobalStore } from '~/stores/globals'
import DesktopFilterService from '~/services/desktop-filter'
import ResponseData from '~/types/ResponseData'

const emit = defineEmits(['setDialogMessage'])
const globalStore = useGlobalStore()
const route = useRoute()
const key = ref('')

const ErrorMessage = ref('')

const officeList = ref([])
const clientList = ref([])
const divisionList = ref([])
const productList = ref([])
const jobList = ref([])
const jobCompList = ref([])
const projectManagerList = ref([])
const trafficStatusList = ref([])
const taskStatusList = ref([])
const employeeCodeList = ref([])
const employeeRoleList = ref([])
const departmentList = ref([])
const taskRoleList = ref([])
const settingsList = ref([])

const selectedEmployees = ref([])

const DisplayOptionFirstName = ref(false)
const DisplayOptionFullName = ref(false)

const showErrorMessage = (err) => {
	emit('setDialogMessage', err, 'Error Message')
}
const showConfirmationMessage = (msg) => {
	emit('setDialogMessage', msg, 'Success')
}
function getFilterForm() {
	DesktopFilterService.getFilterForm()
		.then((response: ResponseData) => {
			if (response.data.success) {
				officeList.value = response.data.Filter.OfficeList.map((el: { Code: string; Description: string }) => {
					return { ...el }
				},
				)
				clientList.value = response.data.Filter.ClientList.map((el) => {
					return { ...el }
				},
				)
				divisionList.value = response.data.Filter.DivisionList.map((el) => {
					return { ...el }
				},
				)
				productList.value = response.data.Filter.ProductList.map((el) => {
					return { ...el }
				},
				)
				jobList.value = response.data.Filter.JobList.map((el) => {
					return { ...el }
				},
				)
				jobCompList.value = response.data.Filter.JobComponentList.map((el) => {
					return { ...el }
				},
				)
				projectManagerList.value = response.data.Filter.ProjectManagerList.map((el) => {
					return { ...el }
				},
				)
				trafficStatusList.value = response.data.Filter.TrafficStatusList.map((el) => {
					return { ...el }
				},
				)
				taskStatusList.value = response.data.Filter.TaskStatusList.map((el) => {
					return { ...el }
				},
				)
				employeeCodeList.value = response.data.Filter.EmployeeCodeList.map((el) => {
					return { ...el }
				},
				)
				employeeRoleList.value = response.data.Filter.EmployeeRoleList.map((el) => {
					return { ...el }
				},
				)
				departmentList.value = response.data.Filter.DepartmentList.map((el) => {
					return { ...el }
				},
				)
				taskRoleList.value = response.data.Filter.TaskRoleList.map((el) => {
					return { ...el }
				},
				)
				settingsList.value = response.data.Filter.CalendarSetting.map((el) => {
					return { ...el }
				},
				)
				if (settingsList.value.find(x => x.Name === 'empdisplayname')?.Value === 'first')
					DisplayOptionFirstName.value = true
				if (settingsList.value.find(x => x.Name === 'empdisplayname')?.Value === 'full')
					DisplayOptionFullName.value = true
			} else {
				showErrorMessage(response.data.ErrorMessage)
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}

function clearAll() {
	DesktopFilterService.getFilterForm()
		.then((response: ResponseData) => {
			if (response.data.success) {
				officeList.value = response.data.Filter.OfficeList.map((el: { Code: string; Description: string }) => {
					return { ...el }
				},
				)
				clientList.value = response.data.Filter.ClientList.map((el) => {
					return { ...el }
				},
				)
				divisionList.value = response.data.Filter.DivisionList.map((el) => {
					return { ...el }
				},
				)
				productList.value = response.data.Filter.ProductList.map((el) => {
					return { ...el }
				},
				)
				jobList.value = response.data.Filter.JobList.map((el) => {
					return { ...el }
				},
				)
				jobCompList.value = response.data.Filter.JobComponentList.map((el) => {
					return { ...el }
				},
				)
				settingsList.value = response.data.Filter.CalendarSetting.map((el) => {
					return { ...el }
				},
				)
				if (settingsList.value.find(x => x.Name === 'empdisplayname')?.Value === 'first')
					DisplayOptionFirstName.value = true
				if (settingsList.value.find(x => x.Name === 'empdisplayname')?.Value === 'full')
					DisplayOptionFullName.value = true

				officeList.value.forEach(e => e.IsSelected = false)
				officeList.value.find(x => x.Code === '').IsSelected = true
				clientList.value.forEach(e => e.IsSelected = false)
				clientList.value.find(x => x.Code === '').IsSelected = true
				divisionList.value.forEach(e => e.IsSelected = false)
				divisionList.value.find(x => x.Code === '').IsSelected = true
				productList.value.forEach(e => e.IsSelected = false)
				productList.value.find(x => x.Code === '').IsSelected = true
				jobList.value.forEach(e => e.IsSelected = false)
				jobList.value.find(x => x.Code === '').IsSelected = true
				jobCompList.value.forEach(e => e.IsSelected = false)
				jobCompList.value.find(x => x.Code === '').IsSelected = true
				trafficStatusList.value.forEach(e => e.IsSelected = false)
				trafficStatusList.value.find(x => x.Code === '').IsSelected = true
				projectManagerList.value.forEach(e => e.IsSelected = false)
				projectManagerList.value.find(x => x.Code === '').IsSelected = true
				taskStatusList.value.forEach(e => e.IsSelected = false)
				taskStatusList.value.find(x => x.Code === '').IsSelected = true
				employeeCodeList.value.forEach(e => e.IsSelected = false)
				employeeCodeList.value.find(x => x.Code === '').IsSelected = true
				employeeRoleList.value.forEach(e => e.IsSelected = false)
				departmentList.value.forEach(e => e.IsSelected = false)
				taskRoleList.value.forEach(e => e.IsSelected = false)

				console.log(taskRoleList)
			} else {
				showErrorMessage(response.data.ErrorMessage)
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}

function refreshFilterList(OfficeCode: string, ClientCode: string, DivisionCode: string, ProductCode: string, JobID: string, JobCompCode: string) {
	DesktopFilterService.refreshFilterList(OfficeCode, ClientCode, DivisionCode, ProductCode, JobID, JobCompCode)
		.then((response: ResponseData) => {
			console.log(response.data)
			if (response.data.success) {
					officeList.value = response.data.Filter.OfficeList.map((el: { Code: string; Description: string }) => {
						return { ...el }
					},
					)
					clientList.value = response.data.Filter.ClientList.map((el) => {
						return { ...el }
					},
					)
					divisionList.value = response.data.Filter.DivisionList.map((el) => {
						return { ...el }
					},
					)
					productList.value = response.data.Filter.ProductList.map((el) => {
						return { ...el }
					},
					)
					jobList.value = response.data.Filter.JobList.map((el) => {
						return { ...el }
					},
					)
					jobCompList.value = response.data.Filter.JobComponentList.map((el) => {
						return { ...el }
					},
				)
			} else {
				showErrorMessage(response.data.ErrorMessage)
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}

function handleSubmit() {
	let data = settingsList.value
	if (officeList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'OfficeCode', Value: officeList.value.find(x => x.IsSelected === true).Code })
	if (clientList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'ClientCode', Value: clientList.value.find(x => x.IsSelected === true).Code })
	if (divisionList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'DivisionCode', Value: divisionList.value.find(x => x.IsSelected === true).Code })
	if (productList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'ProductCode', Value: productList.value.find(x => x.IsSelected === true).Code })
	if (jobList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'JobID', Value: jobList.value.find(x => x.IsSelected === true).Code })
	if (jobCompList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'JobCompID', Value: jobCompList.value.find(x => x.IsSelected === true).Code })
	if (projectManagerList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'ProjectMangerCode', Value: projectManagerList.value.find(x => x.IsSelected === true).Code })
	if (trafficStatusList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'TrafficStatusCode', Value: trafficStatusList.value.find(x => x.IsSelected === true).Code })
	if (taskStatusList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'TaskStatusCode', Value: taskStatusList.value.find(x => x.IsSelected === true).Code })
	if (employeeCodeList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'EmployeeCode', Value: employeeCodeList.value.find(x => x.IsSelected === true).Code })
	if (settingChecked('roles_checked') && employeeRoleList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'EmployeeRoleCode', Value: employeeRoleList.value.reduce((selected, arg) => selected + (arg.IsSelected ? `${arg.Code},` : ''), '') })
	if (departmentList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'DepartmentCode', Value: departmentList.value.reduce((selected, arg) => selected + (arg.IsSelected ? `${arg.Code},` : ''), '') })
	if (settingChecked('roles_checked_func') && taskRoleList.value.find(x => x.IsSelected === true) !== undefined)
		data.push({ Name: 'TaskRoleCode', Value: taskRoleList.value.reduce((selected, arg) => selected + (arg.IsSelected ? `${arg.Code},` : ''), '') })

	console.log(data)
	DesktopFilterService.updateSettings(JSON.stringify(data))
		.then((response: ResponseData) => {
			if (response.data.Success === true) {
				getFilterForm()
				showConfirmationMessage('Settings saved!')
			} else {
				if (response.data.ErrorMessage && response.data.ErrorMessage !== '') {
					showErrorMessage(response.data.ErrorMessage)
				} else {
					showErrorMessage('Something went wrong')
				}
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
}

onMounted(() => {
	getFilterForm()
})

function handleOfficeChange(e) {
	officeList.value.forEach(e => e.IsSelected = false)
	officeList.value.find(x => x.Code === e.value.Code).IsSelected = true
}
function handleClientChange(e) {
	clientList.value.forEach(e => e.IsSelected = false)
	refreshFilterList(officeList.value.find(x => x.IsSelected)?.Code, e.value.Code, '', '', '', '')
}
function handleDivisionChange(e) {
	divisionList.value.forEach(e => e.IsSelected = false)
	refreshFilterList(officeList.value.find(x => x.IsSelected)?.Code, clientList.value.find(x => x.IsSelected)?.Code, e.value.Code, '', '', '')
}
function handleProductChange(e) {
	productList.value.forEach(e => e.IsSelected = false)
	refreshFilterList(officeList.value.find(x => x.IsSelected)?.Code, clientList.value.find(x => x.IsSelected)?.Code, divisionList.value.find(x => x.IsSelected)?.Code, e.value.Code, '', '')
}
function handleJobChange(e) {
	if (e.value.Code === '')
		refreshFilterList(officeList.value.find(x => x.IsSelected)?.Code, clientList.value.find(x => x.IsSelected)?.Code, divisionList.value.find(x => x.IsSelected)?.Code, productList.value.find(x => x.IsSelected)?.Code, '', '')
	else
		refreshFilterList('', '', '', '', e.value.Code, '')
}
function handleJobCompChange(e) {
	if (e.value.Code === '') {
		jobCompList.value.forEach(e => e.IsSelected = false)
		jobCompList.value.find(x => x.Code === e.value.Code).IsSelected = true
	}
	else
		refreshFilterList('', '', '', '', '', e.value.Code)
}
function handleProjectManagerChange(e) {
	projectManagerList.value.forEach(e => e.IsSelected = false)
	projectManagerList.value.find(x => x.Code === e.value.Code).IsSelected = true
}
function handleTrafficStatusChange(e) {
	trafficStatusList.value.forEach(e => e.IsSelected = false)
	trafficStatusList.value.find(x => x.Code === e.value.Code).IsSelected = true
}
function handleTaskStatusChange(e) {
	taskStatusList.value.forEach(e => e.IsSelected = false)
	taskStatusList.value.find(x => x.Code === e.value.Code).IsSelected = true
}
function handleEmployeeCodeChange(e) {
	employeeCodeList.value.forEach(e => e.IsSelected = false)
	employeeCodeList.value.find(x => x.Code === e.value.Code).IsSelected = true
}
function handleEmployeeRoleChange(e: []) {
	employeeRoleList.value.forEach(e => e.IsSelected = false)
	e.forEach(emp => employeeRoleList.value.find(x => x.Code === emp).IsSelected = true)
}
function handleDepartmentChange(e) {
	departmentList.value.forEach(e => e.IsSelected = false)
	e.forEach(emp => departmentList.value.find(x => x.Code === emp).IsSelected = true)
}
function handleTaskRoleChange(e) {
	taskRoleList.value.forEach(e => e.IsSelected = false)
	e.forEach(emp => taskRoleList.value.find(x => x.Code === emp).IsSelected = true)
}

function settingChecked(name) {
	const item = settingsList.value.find(x => x.Name === name)

	return (item && item.Value.toUpperCase() === 'TRUE')
}
function checkBoxChanged(event, name) {
	if (!settingsList.value.find(x => x.Name === name)) {
		const newSetting = { Name: name, Value: event.value }
		settingsList.value.push(newSetting)
	} else {
		if (event.value)
			settingsList.value.find(x => x.Name === name).Value = 'True'
		else
			settingsList.value.find(x => x.Name === name).Value = 'False'
	}
}
function displayNameOption(e) {
	settingsList.value.find(x => x.Name === 'empdisplayname').Value = e.value
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
								Apply
							</Button>
						</ToolbarItem>
						<ToolbarItem>
							<Button
								type="button"
								theme-color="light"
								class="border"
								style="width: 90px"
								@click="clearAll"
							>
								Clear All
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
					<div class="col-sm-6 ps-md-0 pe-md-1">
						<div class="rounded" style="min-height: 320px;">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Projects</h3>
										</div>
										<div class="col-auto pt-2">
											<div class="vr" style="height:14px" />
										</div>
										<div class="col-auto pt-2">
											<Checkbox
												:checked="settingChecked('excludetempcomplete')"
												@change="checkBoxChanged($event, 'excludetempcomplete')"
											/>
											<label for="OmitBeginningBalance" class="form-check-label pe-2">Exclude Temp
												Complete</label>
										</div>
										<div class="col-auto  pt-2">
											<div class="vr" style="height:14px" />
										</div>
										<div class="col-auto pt-2">
											<Checkbox
												:checked="settingChecked('milestone')"
												@change="checkBoxChanged($event, 'milestone')"
											/>
											<label for="ShowPercent" class="form-check-label  pe-2">Display Milestones
												Only</label>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="row text-center">
								<div class="col-md-5">
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Office:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="officeList.find(x => x.IsSelected)"
												:data-items="officeList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleOfficeChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Client:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="clientList.find(x => x.IsSelected)"
												:data-items="clientList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleClientChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Division:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="divisionList.find(x => x.IsSelected)"
												:data-items="divisionList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleDivisionChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Traffic
											Status:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="trafficStatusList.find(x => x.IsSelected)"
												:data-items="trafficStatusList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleTrafficStatusChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Task
											Status:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="taskStatusList.find(x => x.IsSelected)"
												:data-items="taskStatusList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleTaskStatusChange"
											/>
										</div>
									</div>
								</div>
								<div class="col-md-5">
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Product:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="productList.find(x => x.IsSelected)"
												:data-items="productList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleProductChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Job:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="jobList.find(x => x.IsSelected)"
												:data-items="jobList"
												:popup-settings="{ width: 'auto' }"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleJobChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Job Comp:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="jobCompList.find(x => x.IsSelected)"
												:data-items="jobCompList"
												text-field="Description"
												:popup-settings="{ width: 'auto' }"
												data-item-key="Code"
												class="form-control"
												@change="handleJobCompChange"
											/>
										</div>
									</div>
									<div class="row py-2">
										<label for="Office" class="col-sm-4 col-form-label text-right">Project
											Manager:</label>
										<div class="col-sm-8 text-left">
											<DropDownList
												:value="projectManagerList.find(x => x.IsSelected)"
												:data-items="projectManagerList"
												text-field="Description"
												data-item-key="Code"
												class="form-control"
												@change="handleProjectManagerChange"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<br />
						<div class="rounded">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Employees</h3>
										</div>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<br />
							<div class="col-12 p-3 px-5 text-left">
								<div class="row align-items-center">
									<div class="col-auto d-flex">
										Employee Code:
									</div>
									<div class="col-auto">
										<DropDownList
											:value="employeeCodeList.find(x => x.IsSelected)"
											:style="{ width: '200px' }"
											:data-items="employeeCodeList"
											text-field="Description"
											data-item-key="Code"
											class="form-control"
											@change="handleEmployeeCodeChange"
										/>
									</div>
									<div class="col-auto pt-2">
										<div class="vr" style="height:15px" />
									</div>
									<div class="col-auto">
										<Checkbox
											:checked="settingChecked('includeunassigned')"
											@change="checkBoxChanged($event, 'includeunassigned')"
										/>
										<label class="form-check-label pe-2">Include Unassigned (Job Component level
											only)</label>
									</div>
								</div>
							</div>
							<hr style="padding: 0px; margin: 0px" />
							<div class="row p-4 text-left">
								<div class="col-md-4">
									<label class="col-form-label pe-2">Employee Roles:</label>
									<Checkbox
										:class="form - check - input"
										:checked="settingChecked('roles_checked')"
										@change="checkBoxChanged($event, 'roles_checked')"
									/>
									<div class="col-12 text-left">
										<MultiSelect
											:disabled="!settingChecked('roles_checked')"
											:options="employeeRoleList"
											:model-value="employeeRoleList.filter(x => x.IsSelected === true).map((el) => { return el.Code })"
											:list-size="10"
											@selection-changed="handleEmployeeRoleChange"
										/>
									</div>
								</div>
								<div class="col-md-4">
									<label for="Office" class="col-12 col-form-label">Departments:</label>
									<div class="col-12 text-left">
										<MultiSelect
											:options="departmentList"
											:list-size="10"
											:model-value="departmentList.filter(x => x.IsSelected === true).map((el) => { return el.Code })"
											@selection-changed="handleDepartmentChange"
										/>
									</div>
								</div>
								<div class="col-md-4">
									<label class="col-form-label pe-2">Roles:</label>
									<Checkbox
										:class="form - check - input"
										:checked="settingChecked('roles_checked_func')"
										@change="checkBoxChanged($event, 'roles_checked_func')"
									/>
									<div class="col-12 text-left">
										<MultiSelect
											:disabled="!settingChecked('roles_checked_func')"
											:options="taskRoleList"
											:list-size="10"
											:model-value="taskRoleList.filter(x => x.IsSelected === true).map((el) => { return el.Code })"
											@selection-changed="handleTaskRoleChange"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-sm-6 ps-md-0 pe-md-1">
						<div class="rounded" style="min-height: 320px;">
							<div class="row">
								<div class="col-12 p-3 px-5 text-left">
									<div class="row align-items-center">
										<div class="col-auto d-flex">
											<h3>Display Options</h3>
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
											<b>Tasks/Assignments</b>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tclientcode')"
												@change="checkBoxChanged($event, 'tclientcode')"
											/>
											<label class="form-check-label">Client Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tclientdesc')"
												@change="checkBoxChanged($event, 'tclientdesc')"
											/>
											<label class="form-check-label">Client Description</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tdivcode')"
												@change="checkBoxChanged($event, 'tdivcode')"
											/>
											<label class="form-check-label">Division Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tdivdesc')"
												@change="checkBoxChanged($event, 'tdivdesc')"
											/>
											<label class="form-check-label">Division Description</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tprodcode')"
												@change="checkBoxChanged($event, 'tprodcode')"
											/>
											<label class="form-check-label">Product Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tproddesc')"
												@change="checkBoxChanged($event, 'tproddesc')"
											/>
											<label class="form-check-label">
												Product Description</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tjobnum')"
												@change="checkBoxChanged($event, 'tjobnum')"
											/>
											<label class="form-check-label">
												Job Number</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tjobdesc')"
												@change="checkBoxChanged($event, 'tjobdesc')"
											/>
											<label class="form-check-label">
												Job Description</label>
										</div>
									</div>
								</div>
								<div class="col-md-3">
									<div class="row pb-1">
										<div class="col-md-3">
											<b>&nbsp;</b>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tjobcompnum')"
												@change="checkBoxChanged($event, 'tjobcompnum')"
											/>
											<label class="form-check-label pe-2">
												Component Number</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('tjobcompdesc')"
												@change="checkBoxChanged($event, 'tjobcompdesc')"
											/>
											<label class="form-check-label pe-2">
												Component Description</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('ttaskcode')"
												@change="checkBoxChanged($event, 'ttaskcode')"
											/>
											<label class="form-check-label pe-2">
												Task Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('ttaskdesc')"
												@change="checkBoxChanged($event, 'ttaskdesc')"
											/>
											<label class="form-check-label pe-2">
												Task/Assignment Description</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('empcodedispl')"
												@change="checkBoxChanged($event, 'empcodedispl')"
											/>
											<label class="form-check-label pe-2">
												Employee Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('empdescdispl')"
												@change="checkBoxChanged($event, 'empdescdispl')"
											/>
											<label class="form-check-label pe-2">
												Employee Name</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('thoursallowed')"
												@change="checkBoxChanged($event, 'thoursallowed')"
											/>
											<label class="form-check-label pe-2">
												Hours Allowed</label>
										</div>
									</div>
									<div class="row py-1">
										<iv class="col-auto">
											<Checkbox
												:checked="settingChecked('ttimedue')"
												@change="checkBoxChanged($event, 'ttimedue')"
											/>
											<label class="form-check-label pe-2">
												Time Due</label>
										</iv>
									</div>
								</div>
								<div class="col-md-3">
									<div class="row pb-1">
										<div class="col-auto">
											<b>Holidays/Activities</b>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('haemployeecode')"
												@change="checkBoxChanged($event, 'haemployeecode')"
											/>
											<label class="form-check-label">
												Employee Code</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('haemployeedesc')"
												@change="checkBoxChanged($event, 'haemployeedesc')"
											/>
											<label class="form-check-label">
												Employee Name</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('hatype')"
												@change="checkBoxChanged($event, 'hatype')"
											/>
											<label class="form-check-label">
												Type</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('hasubject')"
												@change="checkBoxChanged($event, 'hasubject')"
											/>
											<label class="form-check-label">
												Subject</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('hatimes')"
												@change="checkBoxChanged($event, 'hatimes')"
											/>
											<label class="form-check-label">
												Times</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('hahours')"
												@change="checkBoxChanged($event, 'hahours')"
											/>
											<label class="form-check-label">
												Hours</label>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<Checkbox
												:checked="settingChecked('hatimecat')"
												@change="checkBoxChanged($event, 'hatimecat')"
											/>
											<label class="form-check-label">
												Time Category</label>
										</div>
									</div>
									<div class="row py-1">
										<iv class="col-auto">
											<Checkbox
												:checked="settingChecked('haclientcode')"
												@change="checkBoxChanged($event, 'haclientcode')"
											/>
											<label class="form-check-label">
												Client Code</label>
										</iv>
									</div>
								</div>
								<div class="col-md-3">
									<div class="row pb-1">
										<div class="col-auto">
											<b>Employee Display Options</b>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<RadioButton
												name="namegroup"
												value="first"
												:checked="DisplayOptionFirstName"
												label=" First Name"
												@change="displayNameOption"
											/>
										</div>
									</div>
									<div class="row py-1">
										<div class="col-auto">
											<RadioButton
												name="namegroup"
												value="full"
												:checked="DisplayOptionFullName"
												label=" Last Name"
												@change="displayNameOption"
											/>
										</div>
									</div>
									<div class="row py-1">
										<iv class="col-auto">
											<Checkbox
												:checked="settingChecked('empIncludeImage')"
												@change="checkBoxChanged($event, 'empIncludeImage')"
											/>
											<label class="form-check-label">
												Include Image</label>
										</iv>
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
