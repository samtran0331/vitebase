import http from './http-common'
import authHeader from './auth-header'

class DesktopFiterService {
  getFilterForm() {
       return http.get('/Filter')
  }
   refreshFilterList(OfficeCode: string, ClientCode: string, DivisionCode: string, ProductCode: string, JobID: string, JobCompCode: string) {
     return http.get('/RefreshFilterList', { params: { OfficeCode, ClientCode, DivisionCode, ProductCode, JobID, JobCompCode } })
   }
   updateSettings(params: string) {
    return http.post('/UpdateSettings', { Params: params })
  }
}

export default new DesktopFiterService()
