import http from './http-common'

class WebvantageService {
  openWebvantageDialog(title: string, url: string, height: number, width: number, isModal: boolean) {
    http.post('/OpenWebvantageDialog', { Title: title, URL: url, Height: height, Width: width, IsModal: isModal })
  }
  openWebvantageTab(title: string, url: string) {
    http.post('/OpenWebvantageTab', { Title: title, URL: url })
  }
}
export default new WebvantageService()
