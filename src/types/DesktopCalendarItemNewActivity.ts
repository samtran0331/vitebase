export default interface DesktopCalendarNewActivity {
	activityType: string
	subject?: string
	startDate?: Date
	endDate?: Date
	priority?: number
	reminder?: number
	// employees: Array<any>
	description?: string
	// attachments?: string[]
	// linkedDocuments?: string[]
	isAllDay?: boolean
}