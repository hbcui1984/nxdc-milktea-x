import App from './App'
import store from './store'
import api from '@/api'

// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$api = api
	return { app }
}
// #endif
