import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faBars,
	faEye,
	faPenToSquare,
	faTrash,
	faUserCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from '@/App.vue'
import router from '@/router'
import './styles/index.css'

library.add(faBars, faEye, faPenToSquare, faTrash, faUserCircle)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VueApexCharts)

app.mount('#app')
