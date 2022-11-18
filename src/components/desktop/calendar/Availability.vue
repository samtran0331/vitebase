<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Button,
  Toolbar,
  ToolbarItem,
  ToolbarSpacer,
} from '@progress/kendo-vue-buttons'
import { Grid } from '@progress/kendo-vue-grid'
import { DatePicker } from '@progress/kendo-vue-dateinputs'
import { DropDownList } from '@progress/kendo-vue-dropdowns'
import { Checkbox, Input } from '@progress/kendo-vue-inputs'
import { Loader } from '@progress/kendo-vue-indicators'
import { orderBy } from '@progress/kendo-data-query'
import WebvantageServices from '~/services/webvantage'
import { useGlobalStore } from '~/stores/globals'
import DesktopAvailabilityService from '~/services/desktop-availability'
import ResponseData from '~/types/ResponseData'

const emit = defineEmits(['setDialogMessage'])
const globalStore = useGlobalStore()
const route = useRoute()
const key = ref('')

const viewModel = ref({
	StartDate: new Date(),
	EndDate: new Date(),
    OmitBeginning: false,
    ShowPercent: false,
    HoursAvailableLess: 0,
    HoursAvailableBetweenLess: 0,
    HoursAvailableBetweenGreater: 0,
    HoursAvailableGreater: 0,
    EmployeeList: [],
})

const loader = ref(false)
const assignmentLoader = ref(false)

const AvailabilityData = ref([])
const AssignmentData = ref([])
const AvailabilitySort = ref([{ field: 'Employee', dir: 'asc' }])
const AssignmentSort = ref([{ field: 'StartDate', dir: 'asc' }])
const selectedSummary = ref('')
const selectedEmployee = ref('')
const selectedEmployeeCode = ref('')
const selectedEmployeeName = ref('')
const selectedField = 'selected'

const AppointmentHours = ref(0)
const DirectHoursGoalPercent = ref(0)
const HoursAssigned = ref(0)
const HoursOff = ref(0)
const StandardHoursAvailable = ref(0)
const Variance = ref(0)
const EmployeeImage = ref('')
const AssignmentLoaded = ref(false)
const AssignmentDiv = ref(null)

const HoursAllowedTotal = ref(0)
const BeginningBalanceTotal = ref(0)
const HoursPostedTotal = ref(0)
const HoursLeftTotal = ref(0)
const AllocatedHoursTotal = ref(0)
const totalRecTypes = ['T', 'ET', 'A', 'ADA', 'AHO', 'ADHO', 'C', 'M', 'TD', 'EL', 'AS', 'ASO']

const isSidebarActive = ref(true)

const summaryLevels = [
            {
                label: 'Daily',
                value: '1',
            },
            {
                label: 'Weekly',
                value: '2',
            },
            {
                label: 'Monthly',
                value: '3',
            },
            ]

const fixedAvailabilityColumns = [
	{
      field: 'EmployeeCode',
      title: 'EmployeeCode',
      width: '0px',
    },
    {
      field: 'Office',
      title: 'Office',
      width: '65px',
    },
    {
      field: 'Employee',
      title: 'Employee',
      width: '150px',
    },
    {
      field: 'Department',
      title: 'Department',
      width: '105px',
    },
    {
      field: 'Role',
      title: 'Role',
      width: '60px',
    },
    {
      field: 'Hours Available (Adj)',
      title: 'Hours Available (Adj)',
      width: '110px',
      className: 'allign-right',
    },
    {
      field: 'Direct Hours Goal %',
      title: 'Direct Hours Goal %',
      width: '100px',
      className: 'allign-right',
    },
    {
      field: 'Direct Hours Goal',
      title: 'Direct Hours Goal',
      width: '100px',
      format: '{0:n2}',
      className: 'allign-right',
    },
    {
      field: 'Beginning Balance',
      title: 'Beginning Balance',
      width: '90px',
      format: '{0:n2}',
      className: 'allign-right',
    },
    {
      field: 'Hours Posted',
      title: 'Hours Posted',
      width: '75px',
      format: '{0:n2}',
      className: 'allign-right',
    },
    {
      field: 'Hours Left',
      title: 'Hours Left',
      width: '70px',
      format: '{0:n2}',
      className: 'allign-right',
    },

]
const allAvailabilityColumns = ref<any[]>([])

const AssignmentColumns = [
    {
      field: 'OfficeCode',
      title: 'Office',
      width: '65px',
    },
    {
      field: 'Department',
      title: 'Dept',
      width: '65px',
    },
    {
      field: 'Role',
      title: 'Role',
      width: '65px',
    },
    {
      field: 'Client',
      title: 'Client',
      width: '300px',
    },
    {
      field: 'Project',
      title: 'Project',
      width: '300px',
    },
    {
      field: 'Description',
      title: 'Description',
      width: '160px',
    },
    {
      field: 'StartDate',
      title: 'Start Date',
      width: '95px',
      type: 'date',
      format: '{0:d}',
      footerClassName: 'allign-right',
    },
    {
      field: 'DueDate',
      title: 'Due Date',
      width: '95px',
      type: 'date',
      format: '{0:d}',
      footerClassName: 'allign-right',
    },
    {
      field: 'HoursAllowed',
      title: 'Hours Allowed',
      width: '70px',
      format: '{0:n2}',
      className: 'allign-right',
      footerCell: 'HoursAllowedFooterTemplate',
      footerClassName: 'allign-right',
    },
    {
      field: 'BeginningBalance',
      title: 'Beginning Balance',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
      footerCell: 'BeginningBalanceFooterTemplate',
      footerClassName: 'allign-right',
    },
	{
      field: 'HoursPosted',
      title: 'Hours Posted',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
      footerCell: 'HoursPostedFooterTemplate',
      footerClassName: 'allign-right',
    },
    {
      field: 'HoursLeft',
      title: 'Hours Left',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
      footerCell: 'HoursLeftFooterTemplate',
      footerClassName: 'allign-right',
    },
    {
      field: 'AllocatedHours',
      title: 'Allocated Hours',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
      footerCell: 'AllocatedHoursFooterTemplate',
      footerClassName: 'allign-right',
    },
    {
      field: 'WorkingDays',
      title: 'Working Days',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
    },
    {
      field: 'HoursPerDay',
      title: 'Hours per Work Day',
      width: '80px',
      format: '{0:n2}',
      className: 'allign-right',
    },
    {
      field: '',
      title: '',
      cell: 'veiwDetailsTemplate',
      width: '50px',
    },
]

let showPercent = false

const showErrorMessage = (err) => {
	emit('setDialogMessage', err, 'Error Message')
}

function getAvailabilityForm() {
  DesktopAvailabilityService.getAvailabilityForm()
    .then((response: ResponseData) => {
		if (response.data.success) {
            viewModel.value = {
				StartDate: new Date(response.data.Availability.StartDate),
				EndDate: new Date(response.data.Availability.EndDate),
                OmitBeginning: response.data.Availability.OmitBeginning,
                ShowPercent: response.data.Availability.ShowPercent,
                HoursAvailableLess: response.data.Availability.HoursAvailableLess,
                HoursAvailableBetweenLess: response.data.Availability.HoursAvailableBetweenLess,
                HoursAvailableBetweenGreater: response.data.Availability.HoursAvailableBetweenGreater,
                HoursAvailableGreater: response.data.Availability.HoursAvailableGreater,
                EmployeeList: response.data.Availability.EmployeeList.map((el: { Code: string; Description: string }) => {
                    return {
                        ...el,
                    }
                }),
            }
			showPercent = response.data.Availability.ShowPercent
			selectedEmployee.value = viewModel.value.EmployeeList[0]
		} else {
			showErrorMessage(response.data.ErrorMessage)
		}
    })
    .catch((e: Error) => {
      console.log('ERROR:  ', e)
    })
}
function getAvailability() {
	DesktopAvailabilityService.getAvailability((new Date(viewModel.value.StartDate)).toLocaleDateString(), (new Date(viewModel.value.EndDate)).toLocaleDateString(), selectedEmployee.value.Code, selectedSummary.value, viewModel.value.OmitBeginning, viewModel.value.ShowPercent)
    .then((response: ResponseData) => {
		if (response.data.Success) {
			allAvailabilityColumns.value = fixedAvailabilityColumns.map((el) => {
						return { ...el }
					})
			response.data.DynamicColumnNames.forEach((col) => {
				allAvailabilityColumns.value.push({ field: col, title: col, width: '60px', format: '{0:n2}', className: 'allign-right', cell: 'dataCellTemplate' })
			})
			AvailabilityData.value = JSON.parse(response.data.AvailabilityList).map((el) => {
					return { ...el, selected: false			}
					},
				)
			AvailabilityData.value = orderBy(AvailabilityData.value, AvailabilitySort.value)
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
function getAssignments() {
	DesktopAvailabilityService.GetEmployeeAssignments((new Date(viewModel.value.StartDate)).toLocaleDateString(), (new Date(viewModel.value.EndDate)).toLocaleDateString(), selectedEmployeeCode.value, selectedSummary.value, viewModel.value.OmitBeginning, viewModel.value.ShowPercent)
    .then((response: ResponseData) => {
		if (response.data.Success) {
			AppointmentHours.value = response.data.Assignment.AppointmentHours
			DirectHoursGoalPercent.value = response.data.Assignment.DirectHoursGoalPercent
			HoursAssigned.value = response.data.Assignment.HoursAssigned
			HoursOff.value = response.data.Assignment.HoursOff
			StandardHoursAvailable.value = response.data.Assignment.StandardHoursAvailable
			Variance.value = response.data.Assignment.Variance
			EmployeeImage.value = response.data.Assignment.EmployeeImage
			AssignmentData.value = response.data.Assignment.AssignmentList.map((el) => {
					return {
						...el,
						}
					},
				)
			AssignmentData.value = orderBy(AssignmentData.value, AssignmentSort.value)
			AssignmentLoaded.value = true

			HoursAllowedTotal.value = AssignmentData.value.reduce((total, arg) => total + (totalRecTypes.includes(arg.RecordType) ? arg.HoursAllowed : 0), 0)
			BeginningBalanceTotal.value = AssignmentData.value.reduce((total, arg) => total + (totalRecTypes.includes(arg.RecordType) ? arg.BeginningBalance : 0), 0)
			HoursPostedTotal.value = AssignmentData.value.reduce((total, arg) => total + (totalRecTypes.includes(arg.RecordType) ? arg.HoursPosted : 0), 0)
			HoursLeftTotal.value = AssignmentData.value.reduce((total, arg) => total + (totalRecTypes.includes(arg.RecordType) ? arg.HoursLeft : 0), 0)
			AllocatedHoursTotal.value = AssignmentData.value.reduce((total, arg) => total + (totalRecTypes.includes(arg.RecordType) ? arg.AllocatedHours : 0), 0)
			setTimeout(() => {
				AssignmentDiv.value.scrollIntoView({ behavior: 'smooth' })
			}, 500)
			assignmentLoader.value = false
		} else {
			showErrorMessage(response.data.ErrorMessage)
			assignmentLoader.value = false
		}
    })
    .catch((e: Error) => {
		console.log('ERROR:  ', e)
		assignmentLoader.value = false
    })
}
onMounted(() => {
	getAvailabilityForm()
	selectedSummary.value = '2'
  })

function handleRefreshSubmit() {
	loader.value = true
	AssignmentData.value = []
	AssignmentLoaded.value = false

	const dStartDate = new Date(viewModel.value.StartDate)
	const dEndDate = new Date(viewModel.value.EndDate)

	if (dEndDate < dStartDate) {
		showErrorMessage('End Date must be greater than Start Date.')
		return
	}
	if (dEndDate > new Date(dStartDate.getFullYear() + 1, dStartDate.getMonth(), dStartDate.getDate())) {
		showErrorMessage('Date range must be less than one year.')
		return
	}
    getAvailability()
}

function cellBackground(dataItem, field) {
	const cellValue = dataItem[field]

	if (field.toUpperCase().includes('TOTAL')) {
		return 'text-bold allign-right'
	}

	if (dataItem[`${field}IsOverBooked`] === 1) {
		return 'standard-red-100 allign-right'
	}

	if (showPercent) {
		if (cellValue > 0 && cellValue <= viewModel.value.HoursAvailableLess) {
			return 'standard-light-green allign-right'
		} else if (cellValue > viewModel.value.HoursAvailableBetweenLess && cellValue <= viewModel.value.HoursAvailableBetweenGreater) {
			return 'standard-yellow-100 allign-right'
		} else if (cellValue > viewModel.value.HoursAvailableGreater) {
			return 'standard-red-100 allign-right'
		}
	} else {
		const hoursAvailable = dataItem[`${field}HoursAvailable`]
		if (cellValue > 0 && cellValue <= (hoursAvailable * viewModel.value.HoursAvailableLess / 100)) {
			return 'standard-light-green allign-right'
		} else if (cellValue > (hoursAvailable * viewModel.value.HoursAvailableBetweenLess / 100) && cellValue <= (hoursAvailable * viewModel.value.HoursAvailableBetweenGreater / 100)) {
			return 'standard-yellow-100 allign-right'
		} else if (cellValue > (hoursAvailable * viewModel.value.HoursAvailableGreater / 100)) {
			return 'standard-red-100 allign-right'
		}
	}
	return 'allign-right'
}

function sortChangeHandlerAvailability(e) {
      setTimeout(() => {
        AvailabilitySort.value = e.sort
		AvailabilityData.value = orderBy(AvailabilityData.value, AvailabilitySort.value)
      }, 200)
}
function sortChangeHandlerAssignment(e) {
      setTimeout(() => {
        AssignmentSort.value = e.sort
		AssignmentData.value = orderBy(AssignmentData.value, AssignmentSort.value)
      }, 200)
}
function onGridRowClick(e) {
	assignmentLoader.value = true
	selectedEmployeeCode.value = e.dataItem.EmployeeCode
	selectedEmployeeName.value = e.dataItem.Employee
	AvailabilityData.value.forEach(e => e.selected = false)
	e.dataItem.selected = true
	getAssignments()
}

function toggleSidebar() {
	isSidebarActive.value = !isSidebarActive.value
}
function assignmentRowFormat(h, trElement, defaultSlots, props) {
            const recordType = props.dataItem.RecordType

			let rowStyle
            rowStyle = {}
            if (recordType === 'ET') {
				rowStyle = {
					backgroundColor: '#F7D5DB',
				}
			} else if (recordType === 'A' || recordType === 'ADA' || recordType === 'C' || recordType === 'M'
					|| recordType === 'TD' || recordType === 'EL' || recordType === 'ASO') {
				rowStyle = {
					backgroundColor: '#B2C9E0',
				}
			} else if (recordType === 'AHO' || recordType === 'ADHO') {
				rowStyle = {
					backgroundColor: '#F6E3BC',
				}
			} else if (recordType === 'H') {
				rowStyle = {
					backgroundColor: '#F9DEC7',
				}
			}
			const trProps = {
                style: rowStyle,
				class: trElement.props.class,
            }
            return h(
                'tr',
                trProps,
                defaultSlots)
        }

function viewAssignmentDetails(props) {
	if (props.dataItem.LinkType.toUpperCase() === 'TASK') {
		if (props.dataItem.LinkQs.toUpperCase().includes('ALERTID'))
			WebvantageServices.openWebvantageTab(props.dataItem.LinkTitle, props.dataItem.LinkQs)
		else
			WebvantageServices.openWebvantageDialog(props.dataItem.LinkTitle, props.dataItem.LinkQs, 650, 850, true)
	} else if (props.dataItem.LinkType.toUpperCase() === 'ASSIGNMENT') {
		WebvantageServices.openWebvantageTab(props.dataItem.LinkTitle, props.dataItem.LinkQs)
	} else if (props.dataItem.LinkType.toUpperCase() === 'ACTIVITY') {
		WebvantageServices.openWebvantageDialog(props.dataItem.LinkTitle, props.dataItem.LinkQs, 1000, 1000, false)
	}
}
function clearGrid() {
	AvailabilityData.value = []
	AssignmentData.value = []
	AppointmentHours.value = 0
	DirectHoursGoalPercent.value = 0
	HoursAssigned.value = 0
	HoursOff.value = 0
	StandardHoursAvailable.value = 0
	Variance.value = 0
	EmployeeImage.value = ''
}
</script>

<template>
	<form @submit.prevent="handleRefreshSubmit">
		<fieldset :disabled="loader || assignmentLoader">
			<div id="availabilityComponent" class="">
				<div id="toolbar" class="row">
					<Toolbar>
						<ToolbarItem>
							<DatePicker
								id="startdate"
								v-model="viewModel.StartDate"
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
								v-model="viewModel.EndDate"
								:style="{ width: '150px' }"
								class="form-control"
								@change="clearGrid"
							/>
						</ToolbarItem>
						<ToolbarItem>
							Employee
						</ToolbarItem>
						<ToolbarItem>
							<DropDownList
								v-model="selectedEmployee"
								:style="{ width: '230px' }"
								:data-items="viewModel.EmployeeList"
								text-field="Description"
								data-item-key="Code"
								class="form-control"
								:disabled="viewModel.EmployeeList.length === 1"
								@change="clearGrid"
							/>
						</ToolbarItem>
						<ToolbarItem>
							<Button type="submit" theme-color="primary">
								Refresh
							</Button>
						</ToolbarItem>
						<ToolbarItem>
							<div class="btn-group " role="group">
								<Input
									id="btnradio1"
									v-model="selectedSummary"
									:value="summaryLevels[0].value"
									type="radio"
									class="btn-check"
									name="btnradio"
									autocomplete="off"
									:checked="selectedSummary === '1'"
									@change="clearGrid"
								>
									<label class="btn btn-outline-secondary" for="btnradio1">{{ summaryLevels[0].label }}</label>
									<Input
										id="btnradio2"
										v-model="selectedSummary"
										:value="summaryLevels[1].value"
										type="radio"
										class="btn-check"
										name="btnradio"
										autocomplete="off"
										:checked="selectedSummary === '2'"
										@change="clearGrid"
									>
										<label class="btn btn-outline-secondary" for="btnradio2">{{ summaryLevels[1].label }}</label>
										<Input
											id="btnradio3"
											v-model="selectedSummary"
											:value="summaryLevels[2].value"
											type="radio"
											class="btn-check"
											name="btnradio"
											autocomplete="off"
											:checked="selectedSummary === '3'"
											@change="clearGrid"
										>
											<label class="btn btn-outline-secondary" for="btnradio3">{{ summaryLevels[2].label }}</label>
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
					<div
						id="sidebar"
						:class="{ active: isSidebarActive }"
						class="col-auto border"
					>
						<div class="row" style="padding-left:0">
							<div class="sidebar-icon-div">
								<Button
									type="button"
									:class="{ 'btn-outline-primary': !isSidebarActive, 'btn-outline-dark': isSidebarActive }"
									class="btn sidebar-icon-button"
									@click="toggleSidebar()"
								>
									<span class="k-icon " :class="{ 'k-i-plus-outline': isSidebarActive, 'k-i-minus-outline': !isSidebarActive }" />
								</Button>
							</div>
						</div>
						<div class="row">
							<div class="col-auto">
								<Tooltip
									:open-delay="100"
									position="right"
									anchor-element="target"
								>
									<div class="legend-chicklet rounded" title="Zero hours" />
								</Tooltip>
							</div>
							<div class="col-auto sidebar-lable align-text-center">
								<label class="col-form-label">Zero hours</label>
							</div>
						</div>
						<div class="row">
							<div class="col-auto">
								<Tooltip
									:open-delay="100"
									position="right"
									anchor-element="target"
								>
									<div class="legend-chicklet standard-light-green" :title="`Less than ${viewModel.HoursAvailableLess}% of the Hours Available`" />
								</Tooltip>
							</div>
							<div class="col-auto sidebar-lable">
								<label class="col-form-label">Less than&nbsp;</label>
								<Input
									v-model="viewModel.HoursAvailableLess"
									class="form-input"
									:style="{ width: '40px', textAlign: 'right' }"
									@change="clearGrid"
								/>
								<label class="col-form-label">&nbsp;% of the Hours Available</label>
							</div>
						</div>
						<div class="row">
							<div class="col-auto">
								<Tooltip
									:open-delay="100"
									position="right"
									anchor-element="target"
								>
									<div class="legend-chicklet standard-yellow-100" :title="`Greater than or Equal to ${viewModel.HoursAvailableBetweenLess}% of the Hours Available and Less than ${viewModel.HoursAvailableBetweenGreater}% of the Hours Available`" />
								</Tooltip>
							</div>
							<div class="col-auto sidebar-lable">
								<label class="col-form-label">Greater than or Equal to&nbsp;</label>
								<Input
									v-model="viewModel.HoursAvailableBetweenLess"
									class="form-input"
									:style="{ width: '40px', textAlign: 'right' }"
									@change="clearGrid"
								/>
								<label class="col-form-label">&nbsp;% of the Hours Available and Less than&nbsp;</label>
								<Input
									v-model="viewModel.HoursAvailableBetweenGreater"
									class="form-input"
									:style="{ width: '40px', textAlign: 'right' }"
									@change="clearGrid"
								/>
								<label class="col-form-label">&nbsp;% of the Hours Available</label>
							</div>
						</div>
						<div class="row">
							<div class="col-auto">
								<Tooltip
									:open-delay="100"
									position="right"
									anchor-element="target"
								>
									<div class="legend-chicklet standard-red-100" :title="`Greater than or Equal to ${viewModel.HoursAvailableGreater}% of the Hours Available`" />
								</Tooltip>
							</div>
							<div class="col-auto sidebar-lable">
								<label class="col-form-label">Greater than or Equal to&nbsp;</label>
								<Input
									v-model="viewModel.HoursAvailableGreater"
									class="form-input"
									:style="{ width: '40px', textAlign: 'right' }"
									@change="clearGrid"
								/>
								<label class="col-form-label">&nbsp;% of the Hours Available</label>
							</div>
						</div>
					</div>
					<div id="gridDiv" class="col pe-0">
						<div clas="row">
							<div class="col-12 border p-3 px-5 text-left">
								<div class="row">
									<div class="col-auto d-flex">
										<h3>Availability</h3>
									</div>
									<div class="col-auto" style="padding-top:10px;">
										<div class="vr" style="height:15px" />
									</div>
									<div class="col-auto" style="padding-top:10px;">
										<Checkbox
											id="OmitBeginningBalance"
											v-model="viewModel.OmitBeginning"
											@change="clearGrid"
										/>
										<label for="OmitBeginningBalance" class="form-check-label">Omit Beginning Balance</label>
									</div>
									<div class="col-auto" style="padding-top:10px;">
										<Checkbox
											id="ShowPercent"
											v-model="viewModel.ShowPercent"
											@change="clearGrid"
										/>
										<label for="ShowPercent" class="form-check-label">Show Percent</label>
									</div>
								</div>
							</div>
							<div class="col-12 border border-top-0" :style="[AvailabilityData.length === 0 ? { height: '400px' } : { height: 'unset' }]">
								<div v-if="loader">
									<div class="row " style="padding-top:200px;height: 440px;">
										<div class="col-12 text-center align-middle">
											<Loader size="large" type="infinite-spinner" />
										</div>
									</div>
								</div>
								<div class="row">
									<div v-if="AvailabilityData.length > 0" class="col-xl-12">
										<Grid
											ref="grid"
											:data-items="AvailabilityData"
											:columns="allAvailabilityColumns"
											:sortable="true"
											:sort="AvailabilitySort"
											:selected-field="selectedField"
											@sortchange="sortChangeHandlerAvailability"
											@rowclick="onGridRowClick"
										>
											<template #dataCellTemplate="{ props }">
												<td :class="cellBackground(props.dataItem, props.field)">
													{{ props.dataItem[props.field].toFixed(2) }}
												</td>
											</template>
										</Grid>
									</div>
								</div>
							</div>
						</div>
						<div v-if="assignmentLoader">
							<div class="row " style="padding-top:200px;height: 440px;">
								<div class="col-12 text-center align-middle">
									<Loader size="large" type="infinite-spinner" />
								</div>
							</div>
						</div>
						<div v-if="AssignmentLoaded">
							<div ref="AssignmentDiv" class="border border-top-0 pt-3">
								<div class="row">
									<div class="col-1">
										<div class="float-end rounded p-1">
											<img :src="EmployeeImage">
										</div>
									</div>
									<div class="col-10 text-left " style="padding-top:10px;">
										<h3>Employee Assignments for {{ selectedEmployeeName }} for {{ viewModel.StartDate.toLocaleDateString() }} through {{ viewModel.EndDate.toLocaleDateString() }}</h3>
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
									<div class="col-1 text-right" :style="Variance < 0 ? 'color:red;font-weight:bold' : ''">
										{{ Variance.toFixed(2) }}
									</div>
								</div>
								<div class="row">
									<div class="col-4 text-right">
										% of Direct Hours Goal:
									</div>
									<div class="col-1 text-right">
										{{ DirectHoursGoalPercent.toFixed(2) }}
									</div>
								</div>
								<div class="row ps-4 pt-4">
									<div class="col-auto">
										<div class="legend-chicklet" style="background-color: #B2C9E0" />
									</div>
									<div class="col-auto" style="padding-top:5px;padding-left:0">
										Appointments
									</div>
									<div class="col-auto">
										<div class="legend-chicklet" style="background-color: #F6E3BC" />
									</div>
									<div class="col-auto" style="padding-top:5px;padding-left:0">
										Hours off
									</div>
								</div>
								<div class="row" style="padding-bottom:50px;">
									<div class="col-xl-12">
										<Grid
											id="assignmentListView"
											ref="grid"
											:data-items="AssignmentData"
											:columns="AssignmentColumns"
											:sortable="true"
											:sort="AssignmentSort"
											:row-render="assignmentRowFormat"
											@sortchange="sortChangeHandlerAssignment"
										>
											<template #HoursAllowedFooterTemplate>
												<span>{{ HoursAllowedTotal.toFixed(2) }}</span>
											</template>
											<template #BeginningBalanceFooterTemplate>
												<span>{{ BeginningBalanceTotal.toFixed(2) }}</span>
											</template>
											<template #HoursPostedFooterTemplate>
												<span>{{ HoursPostedTotal.toFixed(2) }}</span>
											</template>
											<template #HoursLeftFooterTemplate>
												<span>{{ HoursLeftTotal.toFixed(2) }}</span>
											</template>
											<template #AllocatedHoursFooterTemplate>
												<span>{{ AllocatedHoursTotal.toFixed(2) }}</span>
											</template>
											<template #veiwDetailsTemplate="{ props }">
												<td>
													{{ props.dataItem.LinkQS }}
													<Button
														v-if="props.dataItem.HasLink"
														theme-color="primary"
														class="btn-circle"
														@click.prevent="viewAssignmentDetails(props)"
													>
														{{ props.dataItem.LinkText }}
													</Button>
												</td>
											</template>
										</Grid>
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
.k-grid-header .k-header > .k-link{
    height: auto;
	white-space: normal ;
}
.k-grid  .k-grid-header  .k-header {
    white-space: normal;
}
.allign-right{
	text-align: right !important;
}
.k-picker{
    background-color: unset;
}
.legend-chicklet {
  border-radius: 4px;
  height: 20px;
  width: 20px;
  margin: 5px auto 10px auto;
}
.text-bold{
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
	font-size:0.9em;
	text-align: left;
}

#sidebar.active {
    min-width: 55px;
    max-width: 55px;
}
#sidebar .sidebar-lable{
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

#sidebar .sidebar-icon-div{
	padding-left:5px;
	padding-bottom:10px;
}
#sidebar .sidebar-icon-button {
	padding: 0.375rem 0.5rem;
}
#sidebar .sidebar-icon-button, #sidebar .sidebar-icon-button:focus {
    box-shadow: unset;
}
.btn-outline-secondary{
	border-color: #e4e7eb;
}
.btn-check:active+.btn, .btn-check:checked+.btn, .btn.active, .btn.show, .btn:active,  .btn-outline-secondary:hover{
    color: #212529;
    border-color: #c7cdd5;
    background-color: #ced3db;
}
</style>

<style>
	#gridDiv{
		width: calc(100% - 150px) !important;
	}
.k-grid-table, .k-grid-header-wrap > table{
	width: 100% !important;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>