import http from './http-common'

class EmployeeService {
	getEmployees() {
		return http.get('/GetEmployees')
	}
	getEmployeesByRole(roleCode: string) {
	return http.get('/GetEmployeesByAlertGroup', { params: { Rolecode: roleCode } })
	}
	getEmployeesByAlertGroup(alertGroupCode: string) {
	return http.get('/GetEmployeesByAlertGroup', { params: { AlertGroupCode: alertGroupCode } })
	}
	}
export default new EmployeeService()
