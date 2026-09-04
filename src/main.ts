import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import { inject } from '@vercel/analytics'

inject()

createApp(App).directive('reveal', vReveal).mount('#app')
