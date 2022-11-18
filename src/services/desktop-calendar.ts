import { Console } from 'console'
import http from './http-common'

class DesktopCalendarService {
  getCalendar(employeeCode: string, startDate: string) {
    return http.get('/GetCalendar', { params: { EmployeeCode: employeeCode, StartDate: startDate } })
  }

  getCalendarForUser(employeeCode: string) {
    return http.get('/GetCalendarForUser', { params: { EmployeeCode: employeeCode } })
  }

  postTest() {
    return http.post('/PostTest')
  }

  addNewCalendarActivity(params: string) {
    return http.post('/AddNewCalendarActivity', { Params: params })
  }

  getNewCalendarActivityEmployeeFilter(filterType: string) {
    return http.get('/GetNewCalendarActivityEmployeeFilter', { params: { FilterType: filterType } })
  }

  getNewCalendarActivityEmployees(filterType: string, filterValue: string) {
    return http.get('/GetNewCalendarActivityEmployees', { params: { FilterType: filterType, FilterValue: filterValue } })
  }
}
export default new DesktopCalendarService()
