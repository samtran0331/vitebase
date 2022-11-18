import http from './http-common'

class RoleService {
	getRoles() {
		return http.get('/GetRoles')
	}

	getRole(roleCode: string) {
		return http.get('/GetRole', { params: { RoleCode: roleCode } })
	}
	}
export default new RoleService()
