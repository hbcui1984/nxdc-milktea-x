import App from './App'
import store from './store'
import api from '@/api'
import util from '@/common/util'

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$api = api
	app.config.globalProperties.$util = util
	return { app }
}
// #endif
