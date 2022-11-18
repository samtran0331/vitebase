import http from './http-common'
import authHeader from './auth-header'

class DesktopReportService {
  getReportForm() {
       return http.get('/Report')
  }
  getReport(params: string) {
    return http.post('/GetReport', { Params: params })
  }
 }

export default new DesktopReportService()
