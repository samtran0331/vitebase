<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
 Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
} from '@progress/kendo-vue-charts'
import { Grid, GridToolbar } from '@progress/kendo-vue-grid'
import { DatePicker } from '@progress/kendo-vue-dateinputs'
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
import { e } from 'unocss'
import { orderBy } from '@progress/kendo-data-query'
import { Loader } from '@progress/kendo-vue-indicators'
import { useGlobalStore } from '~/stores/globals'
import DesktopWorkloadService from '~/services/desktop-workload'
import ResponseData from '~/types/ResponseData'
import WorkloadDetailItem from '~/types/DesktopWorkloadItems'
import WebvantageServices from '~/services/webvantage'

const props = defineProps<{
  currentTab: string
  tabs: {}
}>()
const emit = defineEmits(['setDialogMessage'])
const globalStore = useGlobalStore()
const route = useRoute()
const key = ref('')
const StartDate = ref('')
const EndDate = ref('')
const skip = ref(0)
const take = ref(10)
const total = ref(0)
const loader = ref(true)
const WorkloadHeader = ref('')
const HoursAvailableToital = ref(0)
const HoursCommittedTotal = ref(0)
const TotalHoursUnassigned = ref(0)
const HoursAvailableChartData = ref([])
const HoursCommittedChartData = ref([])
const WorkloadData = ref([])
const PageData = ref([])
const sort = ref([{ field: 'OfficeCode', dir: 'asc' }])
const columnsData = [
    {
      field: 'OfficeCode',
      title: 'Office',
      minWidth: 50,
      width: '75px',
    },
    {
      field: 'ClientCode',
      title: 'Client',
      width: '75px',
    },
    {
      field: 'DivisionCode',
      title: 'Division',
      width: '85px',
    },
    {
      field: 'ProductCode',
      title: 'Product',
      width: '85px',
    },
    {
      field: 'JobNumber',
      title: 'Job Number',
      width: '105px',
      format: '{0:000000}',
    },
    {
      field: 'JobDescription',
      title: 'Job Description',
      minWidth: 100,
    },
    {
      field: 'JobComponentNumber',
      title: 'Job Component',
      format: '{0:000}',
      width: '105px',
    },
    {
      field: 'JobComponentDescription',
      title: 'Component Description',
    },
    {
      field: 'JobStartDate',
      title: 'Start Date',
      format: '{0:MM/dd/yyyy}',
      type: 'date',
      width: '100px',
    },
    {
      field: 'JobDueDate',
      title: 'Job Due Date',
      format: '{0:MM/dd/yyyy}',
      type: 'date',
      width: '110px',
    },
    {
      field: 'CurrentStatus',
      title: 'Current Status',
      width: '120px',
    },
    {
      field: 'TotalHoursUnassigned',
      title: 'Task Hours Unassigned',
      width: '105px',
      footerCell: 'footerTemplate',
      className: 'allign-right',
      footerClassName: 'allign-right',
    },
    {
      field: 'RowID',
      title: ' ',
      width: '50px',
      cell: 'veiwDetailsTemplate',
    },
  ]

const showErrorMessage = (err) => {
	emit('setDialogMessage', err, 'Error Message')
}

function getWorkload() {
	// loader.value = true
	DesktopWorkloadService.getWorkload(StartDate.value == null ? '' : StartDate.value, EndDate.value == null ? '' : EndDate.value)
    .then((response: ResponseData) => {
		if (response.data.success) {
			StartDate.value = new Date(new Date(response.data.Workload.StartDate))
			EndDate.value = new Date(new Date(response.data.Workload.EndDate))
			WorkloadHeader.value = response.data.Workload.WorkloadHeader
			HoursAvailableToital.value = response.data.Workload.HoursAvailableTotal
			HoursCommittedTotal.value = response.data.Workload.HoursCommittedTotal
			TotalHoursUnassigned.value = response.data.Workload.TotalHoursUnassigned
			HoursAvailableChartData.value = response.data.Workload.HoursAvailable.map((el: { DataLabel: string; DataValue: number }) => {
			return {
					DataLabel: el.DataLabel,
					DataValue: `${(el.DataValue / HoursAvailableToital.value * 100).toFixed(2)}%`,
					RawValue: el.DataValue,
				}
			})
			HoursCommittedChartData.value = response.data.Workload.HoursCommitted.map((el: { DataLabel: string; DataValue: number }) => {
			return {
					DataLabel: el.DataLabel,
					DataValue: `${(el.DataValue / HoursCommittedTotal.value * 100).toFixed(2)}%`,
					RawValue: el.DataValue,
				}
			})
			WorkloadData.value = response.data.Workload.WorkloadDetails.map((el: WorkloadDetailItem) => {
				return { ...el			}
				},
			)
			total.value = response.data.Workload.WorkloadDetails ? response.data.Workload.WorkloadDetails.length : 0
			PageData.value = setPage()
		} else {
			showErrorMessage(response.data.ErrorMessage)
		}
		loader.value = false
    })
    .catch((e: Error) => {
       // console.log('ERROR:  ', e)
		loader.value = false
    })
}

onMounted(() => {
  getWorkload()
})

function setPage() {
	return WorkloadData.value.slice(skip.value, take.value + skip.value)
}
function pageChangeHandler(event) {
	loader.value = true
	setTimeout(() => {
		skip.value = event.page.skip
		take.value = event.page.take
		PageData.value = orderBy(setPage(), sort.value)
		loader.value = false
	}, 200)
}
function sortChangeHandler(e) {
      loader.value = true
      setTimeout(() => {
        loader.value = false
        sort.value = e.sort
		PageData.value = orderBy(setPage(), sort.value)
      }, 200)
}

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
	getWorkload()
}
function viewDetails(prop) {
	WebvantageServices.openWebvantageTab('Schedule', `content.aspx?contaid=15&j=${prop.dataItem.JobNumber}&jc=${prop.dataItem.JobComponentNumber}`)
}
function labelContent(e) {
	return `${e.category}: \n ${e.dataItem.RawValue.toLocaleString()} (${e.value})`
}

function clearGrid() {
	WorkloadHeader.value = ''
	HoursAvailableToital.value = 0
	HoursCommittedTotal.value = 0
	TotalHoursUnassigned.value = 0
	HoursAvailableChartData.value = []
	HoursCommittedChartData.value = []
	WorkloadData.value = []
	PageData.value = []
}
</script>

<template>
	<div>
		<form @submit.prevent="handleRefreshSubmit">
			<fieldset :disabled="loader">
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
							<Button type="submit" theme-color="primary">
								Refresh
							</Button>
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
								<h3>Workload</h3>
							</div>
							<div class="col-md-6 text-right">
								<b>{{ WorkloadHeader }}</b>
							</div>
						</div>
						<div class="row border-top">
							<div col="col text-center">
								<table style="height: 100%; width:100%">
									<tr>
										<td style="width:49%">
											<div class="py-4 text-center">
												<b>Hours Available</b>
											</div>
											<div class="k-flex-grow mb-md kd-border kd-rounded chart-item">
												<Chart>
													<ChartSeries>
														<ChartSeriesItem
															type="donut"
															:data-items="HoursAvailableChartData"
															category-field="DataLabel"
															field="DataValue"
														>
															<ChartSeriesLabels
																position="outsideEnd"
																color="black"
																background="none"
																:content="labelContent"
															/>
														</ChartSeriesItem>
													</ChartSeries>
													<ChartLegend :visible="false" />
												</Chart>
											</div>
										</td>
										<td>
											<div class="vr" style="height:60%;" />
										</td>
										<td style="width:49%">
											<div class="py-4 text-center">
												<b>Hours Committed</b>
											</div>
											<div class="k-flex-grow mb-md kd-border kd-rounded chart-item">
												<Chart>
													<ChartSeries>
														<ChartSeriesItem
															type="donut"
															:data-items="HoursCommittedChartData"
															category-field="DataLabel"
															field="DataValue"
														>
															<ChartSeriesLabels
																position="outsideEnd"
																color="black"
																background="none"
																:content="labelContent"
															/>
														</ChartSeriesItem>
													</ChartSeries>
													<ChartLegend :visible="false" />
												</Chart>
											</div>
										</td>
									</tr>
								</table>
							</div>
						</div>
						<div class="row">
							<Grid
								ref="grid"
								style="height: 440px;"
								:data-items="PageData"
								:columns="columnsData"
								:pageable="true"
								:sortable="true"
								:sort="sort"
								:skip="skip"
								:take="take"
								:total="total"
								:loader="load"
								@pagechange="pageChangeHandler"
								@sortchange="sortChangeHandler"
							>
								<template #footerTemplate>
									<span>{{ TotalHoursUnassigned }}</span>
								</template>
								<template #veiwDetailsTemplate="{ props }">
									<td>
										<Button
											icon="k-i-zoom k-i-search"
											theme-color="primary"
											style="color: white;"
											@click.prevent="viewDetails(props)"
										/>
									</td>
								</template>
							</Grid>
						</div>
					</div>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<style>
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
.center {
	text-align: center;
}
</style>

<style>
.k-grid-table, .k-grid-header-wrap > table, .k-grid-footer-wrap > table{
	width: 100% !important;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>