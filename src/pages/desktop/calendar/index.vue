<script setup lang="ts">
import { Button } from '@progress/kendo-vue-buttons'
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs"
import { DateTimePicker } from '@progress/kendo-vue-dateinputs'
const user = useUserStore()
const name = $ref(user.savedName)

const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}

const { t } = useI18n()
const visibleDialog = ref(false)
function myClick(msg: string) {
	// alert(`I clicked a button:\n${msg}`)
}
function toggleDialog() {
	visibleDialog.value = !visibleDialog.value
}
function dialogClick(msg: string) {
	// alert(msg)
	toggleDialog()
}
</script>

<template>
	<div>
		<h3>THIS IS THE INDEX.VUE PAGE IN THE CALENDAR FOLDER!!!!????</h3>
		<hr style="margin: 10px 0px 10px 0px" />
		<img src="../../../images/vite_logo.svg" style="height: 120px;" />
		<hr style="margin: 10px 0px 10px 0px" />
		<DateTimePicker :style="{ width: '260px' }" />
		<hr style="margin: 10px 0px 10px 0px" />
		<Button
			class="k-button wv-icon-button wv-add-new"
			title="Add a new calendar item"
			@click="myClick('wv icon button on calendar page')"
		>
			<span class="wvi wvi-navigate-plus" />Add
		</Button>
		<hr style="margin: 10px 0px 10px 0px" />
		<div id="kendo-controls" style="margin: 25px;">
			<p style="padding: 15px;">
				<Button
					theme-color="primary"
					@click="myClick('hey')"
				>
					Test Button!
				</Button>&nbsp;&nbsp;
				<Button
					icon="folder"
					theme-color="primary"
					@click="myClick('hi')"
				>
					Test Button!
				</Button>&nbsp;&nbsp;
				<Button
					icon="folder"
					theme-color="primary"
					@click="myClick('ho')"
				></Button>
			</p>
			<div>
				<Button @click="toggleDialog">
					Open Dialog
				</Button>
				<Dialog
					v-if="visibleDialog"
					title="Please confirm"
					@close="toggleDialog"
				>
					<p :style="{ margin: '25px', textAlign: 'center' }">
						Are you sure you want to continue?
					</p>
					<DialogActionsBar>
						<Button @click="dialogClick('No!')">
							No
						</Button>
						<Button @click="dialogClick('Yes!')">
							Yes
						</Button>
					</DialogActionsBar>
				</Dialog>
			</div>
		</div>
		<div id="name-test">
			<input
				id="input"
				v-model="name"
				:placeholder="t('intro.whats-your-name')"
				:aria-label="t('intro.whats-your-name')"
				type="text"
				autocomplete="false"
				p="x4 y2"
				w="250px"
				text="center"
				bg="transparent"
				border="~ rounded gray-200 dark:gray-700"
				outline="none active:none"
				@keydown.enter="go"
			>
			<label class="hidden" for="input">{{ t('intro.whats-your-name') }}</label>
			<div>
				<Button
					btn
					m-3
					text-sm
					:disabled="!name"
					@click="go"
				>
					{{ t('button.go') }}
				</Button>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>
