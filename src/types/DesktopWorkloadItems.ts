export default interface WorkloadDetailItem {
    RowID: number
    OfficeCode: String
    ClientCode: String
    DivisionCode: String
    ProductCode: String
    JobNumber: number
    JobDescription: String
    JobComponentNumber: number
    JobComponentDescription: String
    JobStartDate: Date
    JobDueDate: Date
    CurrentStatus: String
    TotalOpenTasks: number
    OldHoursAssigned: number
    OldHoursUnassigned: number
    TotalHoursAssigned: number
    TotalHoursUnassigned: number
    TotalAdjJobHours: number
    TotalHoursPerDay: number
    ShowUnassignedColumn: number
   }