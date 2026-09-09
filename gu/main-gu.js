import { createApp } from 'vue'
import App from '../src/App.vue'
import resume from '../src/data/gu.js'
import '../src/style.css'

createApp(App, { resume }).mount('#app')
