<!-- eslint-disable no-extend-native -->
<script setup lang="ts">
import { PropType, ref } from 'vue'
import { $ref } from 'vue/macros'
import { useField, useForm } from 'vee-validate'
import * as Yup from 'yup'
import { DropDownList, MultiSelect } from '@progress/kendo-vue-dropdowns'
import { DateTimePicker } from '@progress/kendo-vue-dateinputs'
import { Button, ButtonGroup } from '@progress/kendo-vue-buttons'
import { RadioButton, RadioGroup } from '@progress/kendo-vue-inputs'
import { Editor } from '@progress/kendo-vue-editor'
import { Upload } from '@progress/kendo-vue-upload'
import { TabStrip } from '@progress/kendo-vue-layout'
import { add, differenceInMinutes, roundToNearestMinutes } from 'date-fns'
import EditorTools from '~/utils/editor-tools'
import DesktopCalendarNewActivity from '~/types/DesktopCalendarItemNewActivity'
import WvInput from '~/components/shared/WvInput.vue'
import DesktopCalendarService from '~/services/desktop-calendar'
import ResponseData from '~/types/ResponseData'
import CalendarTypes from '~/utils/calendar-types'
import CalendarPriorities from '~/utils/calendar-priorities'
import CalendarReminders from '~/utils/calendar-reminders'

const props = defineProps<{
}>()
const emit = defineEmits(['refreshParent', 'closeNewActivity'])

function emitRefresh() {
    emit('refreshParent')
}
function emitCloseNewActivity() {
    emit('closeNewActivity')
}
const employeeFilter = ref('none')
const { handleSubmit } = useForm()
const { value: type, errorMessage: typeErrorMessage } = useField<string>('fld.type', validateType)
const { value: subject, errorMessage: subjectErrorMessage } = useField<string>('fld.subject', validateSubject)
const { value: isAllDay } = useField<boolean>('fld.isAllDay')
const { value: start, errorMessage: startErrorMessage } = useField<Date>('fld.start', validateStart)
const { value: end, errorMessage: endErrorMessage } = useField<Date>('fld.end', validateEnd)
const { value: priority, errorMessage: priorityErrorMessage } = useField<number>('fld.priority', validatePriority)
const { value: reminder } = useField<number>('fld.reminder')
const { value: description } = useField<string>('fld.description')
const employees = ref([])
const attachments = ref([])
const uploadFiles = ref([])
const linkedDocuments = ref([])
const baseTypes = CalendarTypes.filter((obj) => {
	return obj.isBase === true
})
const descriptionEditor = ref()
const employeeFilters = ref([
          {
            label: 'Show all employees',
            value: 'none',
          },
          {
            label: 'Filter by role',
            value: 'role',
          },
          {
            label: 'Filter by alert group',
            value: 'alert',
          },
        ])
// const schema = Yup.object().shape({
//     subject: Yup.string()
//         .required('Subject is required'),
// })

const selectedEmployeeCodes = ref([])
const onSubmit = handleSubmit((values) => {
	// description.value = descriptionEditor.value.getHTML()
	let data = {
		Type: type.value,
		Subject: subject.value,
        StartDate: start.value,
        EndDate: end.value,
		IsAllDay: isAllDay.value,
		Priority: priority.value,
		Reminder: reminder.value,
		Description: descriptionEditor.value.getHTML(),
		Employees: selectedEmployeeCodes.value,
	}
	DesktopCalendarService.addNewCalendarActivity(JSON.stringify(data))
		.then((response: ResponseData) => {
			console.log('datahhh', response.data)
			if (response.data.Success === true) {
				console.log('Save success')
				emitCloseNewActivity()
			} else {
				if (response.data.ErrorMessage && response.data.ErrorMessage !== '') {
					// eslint-disable-next-line no-alert
					alert(response.data.ErrorMessage)
				} else {
					// eslint-disable-next-line no-alert
					alert('Something went wrong')
				}
			}
		})
		.catch((e: Error) => {
			console.log('ERROR:  ', e)
		})
})
const optionalInfoTabs = ref([{
					id: 0,
                    title: 'Description',
                    content: 'DescriptionTab',
                },
                {
					id: 1,
                    title: 'Attachments',
                    content: 'AttachmentsTab',
                },
                {
					id: 2,
                    title: 'Job',
                    content: 'JobTab',
                },
                {
					id: 3,
                    title: 'Employees',
                    content: 'EmployeesTab',
                },
				])
const selectedTab = ref(0)
const selectedEmployeeFilter = ref('')
const employeeData = ref([])
const employeeFilterData = ref([])
// const employeeRoles = ref([])
// const employeemailGroups = ref([])

function optionalInfoTabOnSelect(e) {
	selectedTab.value = e.selected
}
function cancelClick() {
    // console.log('cancelClicked')
    emitCloseNewActivity()
}
function validateType(value) {
	if (!value) {
		return 'Type is required'
	}
	return true
}
function validateSubject(value) {
	if (!value) {
		return 'Subject is required'
	}
	return true
}
function validatePriority(value) {
	// console.log('validatePriority', value)
	if (!value) {
		return 'Priority is required'
	}
	return true
}
function validateStart(value) {
	// console.log('validateStart', value, end.value)
	if (!value) {
		return 'Start is required'
	} else {
		if (end.value) {
			let diff: number = differenceInMinutes(value, end.value)
			if (diff === 0) {
				return 'Start is the same as End'
			} else if (diff > 0) {
				return 'Start is after End'
			}
		}
	}
	return true
}
function validateEnd(value) {
	// console.log('validateEnd', value, start.value)
	if (!value) {
		return 'End is required'
	} else {
		if (start.value) {
			let diff: number = differenceInMinutes(value, start.value)
			if (diff === 0) {
				return 'End is the same as Start'
			} else if (diff < 0) {
				return 'End is before Start'
			}
		}
	}
	return true
}
function uploadHasOneFile() {
	// return uploadFiles.value.some((f) => f.status === 4)
}
function uploadOnAdd(e) {
	console.log('uploadOnAdd', e)
	uploadFiles.value = e.newState
}
function uploadOnRemove(e) {
	console.log('uploadOnRemove', e)
	uploadFiles.value = e.newState
}
function uploadOnProgress(e) {
	console.log('uploadOnProgress', e)
	uploadFiles.value = e.newState
}
function uploadOnStatusChange(e) {
	console.log('uploadOnStatusChange', e)
	uploadFiles.value = e.newState
}
function employeeFilterChanged(e) {
	employeeFilter.value = e.value
	getEmployeeFilterList()
}
function getEmployeeFilterList() {
	employeeFilterData.value = []
	if (employeeFilter.value === 'none') {
		getEmployeeList()
	} else {
		DesktopCalendarService.getNewCalendarActivityEmployeeFilter(employeeFilter.value)
			.then((response: ResponseData) => {
				if (response.data.Success === true) {
					employeeFilterData.value = response.data.Items
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
}
function getEmployeeList() {
	employeeData.value = []
	DesktopCalendarService.getNewCalendarActivityEmployees(employeeFilter.value, selectedEmployeeFilter.value)
		.then((response: ResponseData) => {
			if (response.data.Success === true) {
				employeeData.value = response.data.Items
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
function employeeMultiSelectOnChange(e) {
	console.log('employeeMultiSelectOnChange', e)
	selectedEmployeeCodes.value = e.value
}
function employeeFilterDropDownListOnChange(e) {
	getEmployeeList()
}
function init() {
	// start/end
	start.value = new Date()
	end.value = new Date()
	// start.value = roundToNearestMinutes(start.value, { nearestTo: 30, roundingMethod: 'ceil' })
	start.value = roundToNearestMinutes(start.value, { nearestTo: 30 })
	let now = new Date()
	if (start.value < now) {
		start.value = add(start.value, { minutes: 30 })
		start.value = roundToNearestMinutes(start.value, { nearestTo: 30 })
	}
	end.value = add(start.value, { hours: 1 })
	isAllDay.value = false
	priority.value = 3
	reminder.value = -1
}
onMounted(() => {
	// console.log('NewActivity mounted')
	init()
})
</script>

<template>
	<form @submit="onSubmit">
		<div class="row g-3">
			<div class="col-12">
				<label for="type" class="form-label">Type</label>
				<DropDownList
					v-model="type"
					name="type"
					:style="{ width: '100%' }"
					:data-items="baseTypes"
					text-field="text"
					data-item-key="value"
					value-field="value"
					:value-primitive="true"
					:class="{ 'is-invalid': typeErrorMessage }"
				/>
				<div class="invalid-feedback">
					{{ typeErrorMessage }}
				</div>
			</div>
			<div class="col-12">
				<label for="subject" class="form-label">Subject</label>
				<input
					v-model="subject"
					name="subject"
					type="text"
					class="form-control required-input"
					placeholder="Subject"
					:class="{ 'is-invalid': subjectErrorMessage }"
				/>
				<div class="invalid-feedback">
					{{ subjectErrorMessage }}
				</div>
			</div>
			<div class="col-md-6">
				<label for="start" class="form-label">Start</label>
				<DateTimePicker
					v-model="start"
					name="start"
					:class="{ 'is-invalid': startErrorMessage }"
					:default-value="start"
				/>
				<div class="invalid-feedback">
					{{ startErrorMessage }}
				</div>
			</div>
			<div class="col-md-6">
				<label for="end" class="form-label">End</label>
				<DateTimePicker
					v-model="end"
					name="end"
					:class="{ 'is-invalid': endErrorMessage }"
					:default-value="end"
				/>
				<div class="invalid-feedback">
					{{ endErrorMessage }}
				</div>
			</div>
			<div class="col-12">
				<div class="form-check">
					<label class="form-check-label" for="isAllDay"> All Day </label>
					<input
						v-model="isAllDay"
						name="isAllDay"
						class="form-check-input"
						type="checkbox"
					/>
				</div>
			</div>
			<div class="col-md-6">
				<label for="priority" class="form-label">Priority</label>
				<DropDownList
					v-model="priority"
					name="priority"
					:style="{ width: '100%' }"
					:data-items="CalendarPriorities"
					text-field="text"
					data-item-key="value"
					value-field="value"
					:value-primitive="true"
					default-item="Normal"
					:class="{ 'is-invalid': priorityErrorMessage }"
				/>
				<div class="invalid-feedback">
					{{ priorityErrorMessage }}
				</div>
			</div>
			<div class="col-md-6">
				<label for="reminderDropDownList" class="form-label">Reminder</label>
				<DropDownList
					id="reminderDropDownList"
					v-model="reminder"
					:style="{ width: '100%' }"
					:data-items="CalendarReminders"
					text-field="text"
					data-item-key="value"
					value-field="value"
					:value-primitive="true"
					default-item="None"
				/>
			</div>
			<TabStrip
				:selected="selectedTab"
				:tabs="optionalInfoTabs"
				@select="optionalInfoTabOnSelect"
			>
				<template #DescriptionTab>
					<div class="col-12">
						<Editor
							ref="descriptionEditor"
							v-model="description"
							:tools="EditorTools"
							:content-style="{ height: '175px' }"
							default-edit-mode="div"
						/>
					</div>
				</template>
				<template #AttachmentsTab>
					<div class="col-12">
						<Upload
							:files="uploadFiles"
							:batch="false"
							:multiple="true"
							:with-credentials="false"
							save-url="https://demos.telerik.com/kendo-ui/service-v4/upload/save"
							remove-url="https://demos.telerik.com/kendo-ui/service-v4/upload/remove"
							@add="uploadOnAdd"
							@remove="uploadOnRemove"
							@progress="uploadOnProgress"
							@statuschange="uploadOnStatusChange"
						/>
					</div>
				</template>
				<template #JobTab>
					<div class="col-12">
						job stuff!
					</div>
				</template>
				<template #EmployeesTab>
					<div class="col-12">
						<div style="margin-top: 6px">
							<RadioGroup
								:value="employeeFilter"
								:data-items="employeeFilters"
								layout="horizontal"
								@change="employeeFilterChanged"
							/>
						</div>
						<div style="margin-bottom: 6px;">
							<div class="col-md-6">
								<DropDownList
									id="employeeFilterDropDownList"
									v-model="selectedEmployeeFilter"
									:style="{ width: '644px' }"
									:data-items="employeeFilterData"
									text-field="Text"
									data-item-key="Value"
									value-field="Value"
									:value-primitive="true"
									default-item="None"
									@change="employeeFilterDropDownListOnChange"
								/>
							</div>
						</div>
						<MultiSelect
							v-model="selectedEmployeeCodes"
							:data-items="employeeData"
							text-field="Text"
							data-item-key="Value"
							value-field="Value"
							:value-primitive="true"
						></MultiSelect>
					</div>
				</template>
			</TabStrip>
			<div class="col-12 text-right">
				<ButtonGroup>
					<Button @click="cancelClick">
						Cancel
					</Button>
					<Button type="submit" theme-color="primary">
						Submit
					</Button>
				</ButtonGroup>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
