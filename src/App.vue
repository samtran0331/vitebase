<script setup lang="ts">
import '@progress/kendo-theme-default/dist/all.css'
import { useRoute } from 'vue-router'
import { Fade } from '@progress/kendo-vue-animation'
import { Notification, NotificationGroup } from '@progress/kendo-vue-notification'
const route = useRoute()
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Webvantage.Vue',
  meta: [
    { name: 'description', content: 'Webvantage.Vue3' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})
// Notification
const notificationVisible = ref(false)
function onNotificationClose() {
  notificationVisible.value = !notificationVisible.value
}
onMounted(() => {
  // console.log('App.vue mounted!')
  // if (localStorage.getItem('userToken')) {
  //   // console.log('token found!', localStorage.getItem('userToken'))
  // } else {
    if (route.query && route.query.usrtkn) {
      localStorage.setItem('userToken', route.query.usrtkn.toString())
    }
  // }
})
</script>

<template>
	<router-view />
	<NotificationGroup
		:style="{
			top: 0,
			left: '50%',
			transform: 'translateX(-50%)',
		}"
	>
		<Fade :appear="notificationVisible">
			<Notification
				v-if="notificationVisible"
				:type="{ style: 'success', icon: true }"
				:closable="true"
				@close="onNotificationClose"
			>
				<span>Your data has been saved.<br /> Does it <strong>HTML?</strong>></span>
			</Notification>
		</Fade>
	</NotificationGroup>
</template>
