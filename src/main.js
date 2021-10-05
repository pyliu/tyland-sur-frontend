import App from './App.vue'
import { createApp } from 'vue'
import Varlet from '@varlet/ui'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@varlet/ui/es/style'

createApp(App).use(Varlet).mount('#app')
