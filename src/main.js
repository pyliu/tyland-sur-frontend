import App from './App.vue'
import { createApp } from 'vue'
import Varlet from '@varlet/ui'
import '@varlet/ui/es/style.js'

createApp(App).use(Varlet).mount('#app')
