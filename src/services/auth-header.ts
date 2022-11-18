export default function authHeader() {
	if (localStorage.getItem('userToken')) {
		// eslint-disable-next-line prefer-template
		return { Authorization: 'Bearer ' + localStorage.getItem('userToken')?.toString() }
	} else {
		return {}
	}
}