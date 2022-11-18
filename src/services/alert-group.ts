import http from './http-common'

class AlertGroupService {
	getAlertGroups() {
		return http.get('/GetAlertGroups')
	}

	getAlertGroup(alertGroupCode: string) {
		return http.get('/GetAlertGroup', { params: { AlertGroupCode: alertGroupCode } })
	}
	}
export default new AlertGroupService()
