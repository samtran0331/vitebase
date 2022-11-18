import http from './http-common'
import authHeader from './auth-header'

class DesktopWorkloadService {
  getWorkload(StartDate: string, EndDate: string) {
    return http.get('/GetWorkload', { params: { StartDate, EndDate } })
  }
}

export default new DesktopWorkloadService()
