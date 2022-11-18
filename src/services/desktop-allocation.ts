import http from './http-common'
import authHeader from './auth-header'

class DesktopAllocationService {
  getAllocationForm() {
    return http.get('/Allocation')
  }
  getAllocation(startDate: string, endDate: string, employeeCode: string, summaryLevel: string) {
    return http.get('/getAllocation', { params: { startDate, endDate, employeeCode, summaryLevel } })
  }
  getAllocationDepartment(startDate: string, endDate: string, employeeCode: string, summaryLevel: string, department: string) {
    return http.get('/GetAllocationDepartment', { params: { startDate, endDate, employeeCode, summaryLevel, department } })
  }
  getAllocationEmployee(startDate: string, endDate: string, employeeCode: string, summaryLevel: string) {
    return http.get('/GetAllocationEmployee', { params: { startDate, endDate, employeeCode, summaryLevel } })
  }
}

export default new DesktopAllocationService()