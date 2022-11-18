import http from './http-common'
import authHeader from './auth-header'

class DesktopAvailabilityService {
  getAvailabilityForm() {
    return http.get('/Availability')
  }
  getAvailability(startDate: string, endDate: string, employeeCode: string, summaryLevel: string, omitBeginningBalance: boolean, showPercent: boolean) {
    return http.get('/GetAvailability', { params: { startDate, endDate, employeeCode, summaryLevel, omitBeginningBalance, showPercent } })
  }
  GetEmployeeAssignments(startDate: string, endDate: string, employeeCode: string, summaryLevel: string, omitBeginningBalance: boolean, showPercent: boolean) {
    return http.get('/GetEmployeeAssignments', { params: { startDate, endDate, employeeCode, summaryLevel, omitBeginningBalance, showPercent } })
  }
}

export default new DesktopAvailabilityService()
