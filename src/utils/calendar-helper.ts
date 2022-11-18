function setSchedulerItemColor(p: string) {
const colorCode = ref('')
if (p === 'TA') {
	colorCode.value = '#198754' // task active
} else if (p === 'TP') {
	colorCode.value = '#6c757d' // task projected
} else if (p === 'TN') {
	colorCode.value = '#198754' // task (?)
} else if (p === 'TD') {
	colorCode.value = '#664d03' // to do
} else if (p === 'M') {
	colorCode.value = '#08A2C0' // meeting
} else if (p === 'C') {
	colorCode.value = '#055160' // call
} else if (p === 'A') {
	colorCode.value = '#077990' // appointment
} else if (p === 'H') {
	colorCode.value = '#ca6510' // holiday
} else if (p === 'E') {
	colorCode.value = '#801F4F' // event
} else if (p === 'ET') {
	colorCode.value = '#AB286A' // event task
} else if (p === 'EL') {
	colorCode.value = '#CC9A07' // email (?)
} else if (p === 'AS') {
	colorCode.value = '#59359A' // assignment
} else if (p === 'ASO') {
	colorCode.value = '#432874' // office assignment
}
return colorCode.value
}
function setSchedulerItemForeColor(p: any) {
	console.log('setSchedulerItemForeColor', p)
}
export default { setSchedulerItemColor, setSchedulerItemForeColor }