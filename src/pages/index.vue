<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@progress/kendo-vue-buttons'
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs"
import { ScrollView } from '@progress/kendo-vue-scrollview'
import { useGlobalStore } from '../stores/globals'
import vueLogo from '../images/vue_logo.svg'
import aquaLogo from '../images/simplifi_aqua_color_logo.png'
import viteLogo from '../images/vite_logo.svg'
import piniaImage from '../images/pinia_logo.svg'
const route = useRoute()
const store = useGlobalStore()

const user = useUserStore()
const name = $ref(user.savedName)
const router = useRouter()
const go = () => {
  if (name)
    router.push(`/hi/${encodeURIComponent(name)}`)
}
const { t } = useI18n()
const visibleDialog = ref(false)
const items = ref([
    {
        position: 1,
        url: aquaLogo,
    },
    // {
    //     position: 2,
    //     url: 'https://picsum.photos/512/512?random=1',
    // },
    {
        position: 3,
        url: vueLogo,
    },
    // {
    //     position: 4,
    //     url: 'https://picsum.photos/512/512?random=2',
    // },
    {
        position: 5,
        url: viteLogo,
    },
    // {
    //     position: 6,
    //     url: 'https://picsum.photos/512/512?random=3',
    // },
    {
        position: 7,
        url: piniaImage,
    },
    // {
    //     position: 8,
    //     url: 'https://picsum.photos/512/512?random=4',
    // },
    // {
    //     position: 9,
    //     url: 'https://picsum.photos/512/512?random=5',
    // },
])
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
onMounted(() => {
    if (route.query && route.query.dl) {
        store.setToken(route.query.dl.toString())
        console.log('Setting store.connToken', store.connToken)
    }
})
</script>

<template>
	<div>
		<div style="display: none;">
			<div text-4xl>
				<div i-carbon-campsite inline-block />
			</div>
			<p>
				<a
					rel="noreferrer"
					href="https://github.com/antfu/vitesse"
					target="_blank"
				>
					Vitesse
				</a>
			</p>
			<p>
				<em text-sm opacity-75>{{ t('intro.desc') }}</em>
			</p>

			<div py-4 />
		</div>
		<h3>THIS IS THE MAIN INDEX.VUE PAGE!?!?!</h3>
		<div id="kendo-controls" style="margin: 25px;">
			<hr style="margin: 10px 0px 10px 0px" />
			<ScrollView
				:style="{
					width: '256px',
					height: '256px',
				}"
				:data-items="items"
				content="content"
				:endless="true"
				:automatic-view-change-interval="5000"
			>
				<template #content="{ props }">
					<div class="image-with-text">
						<!-- <p>
          Showing image: {{ props.item.url }} :: {{ props.item.position }} of {{ props.items.length }}.
        </p> -->
						<img :src="props.item.url" :draggable="false" />
					</div>
				</template>
			</ScrollView>
			<hr style="margin: 10px 0px 10px 0px" />
			<img
				:src="piniaImage"
				style="height: 120px;"
			/>
			<hr style="margin: 10px 0px 10px 0px" />
			<Button
				class="k-button wv-icon-button wv-add-new"
				title="Add a new calendar item"
				@click="myClick('wv icon button')"
			>
				<span class="wvi wvi-navigate-plus" />Add
			</Button>
			<hr style="margin: 10px 0px 10px 0px" />
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

<style scoped lang="scss">
/* center the Carousel horizontally */
/* k-scrollview is the default component class */
.k-scrollview {
    margin: 0 auto;
}
/* enable absolute positioning inside the Carousel template */
.image-with-text {
    position: relative;
}

/* style the overlay text inside the Carousel */
.image-with-text > p {
    position: absolute;
    top: 1rem;
    left: 1.6rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    font-style: italic;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
}
.logo {
    height: 100px;
    width: 100px;
    display: inline-flex;
}
.built-with {
    margin: 12px;
    color: #ffffff;
    font-size: large;
    font-weight: bold;
    text-align: center;
    background: rgb(116, 207, 176);
    background: linear-gradient(
        90deg,
        rgba(116, 207, 176, 1) 0%,
        rgba(79, 172, 228, 1) 85%
    );
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
