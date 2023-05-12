/**
 * plugins/user.d.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import VueApexCharts from 'vue3-apexcharts'
import 'virtual:svg-icons-register';

import VueDraggable from "vuedraggable";
// Types
import type {App} from 'vue'

export function registerPlugins(app: App) {
  app.use(vuetify)
  app.use(vueI18n)
  app.component('apexchart', VueApexCharts)
  app.component('draggable', VueDraggable)


}
