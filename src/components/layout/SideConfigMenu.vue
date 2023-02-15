<template>
  <div>
    <v-btn
      theme="dark"
      ref="refButton"
      class="drawer-button"
      color="#ee44aa"
      @click="right = true"
    >
      <v-icon class="fa-spin">mdi-cog-outline</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="right"
      location="right"
      floating
      temporary
      width="310"
    >
      <div class="d-flex align-center pa-2">
        <div class="title">Settings</div>
        <v-spacer></v-spacer>
        <v-btn flat icon @click="right = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider></v-divider>

      <div class="pa-2">
        <div class="font-weight-bold my-1">Follow Os Theme</div>
        <v-switch v-model="followOs" color="primary"></v-switch>
        <div class="font-weight-bold my-1">Global Theme</div>
        <v-btn-toggle v-model="theme" color="primary" mandatory class="mb-2">
          <v-btn>Light</v-btn>
          <v-btn>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Theme</div>
        <v-btn-toggle v-model="toolbarTheme" color="primary" mandatory class="mb-2">
          <v-btn>Global</v-btn>
          <v-btn>Light</v-btn>
          <v-btn>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Toolbar Style</div>
        <v-btn-toggle v-model="toolbarStyle" color="primary" mandatory class="mb-2">
          <v-btn>Full</v-btn>
          <v-btn>Solo</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Content Layout</div>
        <v-btn-toggle v-model="contentBoxed" color="primary" mandatory class="mb-2">
          <v-btn>Fluid</v-btn>
          <v-btn>Boxed</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Menu Theme</div>
        <v-btn-toggle v-model="menuTheme" color="primary" mandatory class="mb-2">
          <v-btn>Global</v-btn>
          <v-btn>Light</v-btn>
          <v-btn>Dark</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">Primary Color</div>

        <v-color-picker v-model="color" mode="hexa" :swatches="swatches" show-swatches></v-color-picker>
      </div>

      <v-divider></v-divider>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import {ComponentPublicInstance} from "vue";
import {useOsTheme} from "vooks";

const right = ref(false)
const followOs = ref(false)
const theme = ref(0)
const toolbarTheme = ref(0)
const toolbarStyle = ref(0)
const contentBoxed = ref(0)
const menuTheme = ref(0)
const color = ref('#0096c7')
let timeout: NodeJS.Timeout
const swatches = reactive([['#0096c7', '#31944f'],
  ['#EE4f12', '#46BBB1'],
  ['#ee44aa', '#55BB46']])
const appStore = useAppStore()
const {theme: themeConfig} = storeToRefs(appStore)
const {themes, global} = useTheme()

const osTheme = useOsTheme()
const setTheme = (theme: string | null) => {
  if (theme) {
    themeConfig.value.globalTheme = theme
    global.name.value = themeConfig.value.globalTheme
  }
}
theme.value = osTheme.value == 'dark' ? 1 : 0
followOs.value = themeConfig.value.followOs
setTheme(osTheme.value)

watch(osTheme, (val) => {
  setTheme(val)
})

watch(color, (val) => {
  themes.value["dark"].colors.primary = val
  themes.value["light"].colors.primary = val
})
watch(followOs, (val) => {
  themeConfig.value.isContentBoxed = val
})
watch(theme, (val) => {
  setTheme(val === 0 ? 'light' : 'dark')
})
watch(contentBoxed, (val) => {
  themeConfig.value.isContentBoxed = val == 1
})

watch(toolbarStyle, (val) => {
  themeConfig.value.isToolbarDetached = val == 1
})

watch(toolbarTheme, (val) => {
  themeConfig.value.toolbarTheme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')
})
watch(menuTheme, (val) => {
  themeConfig.value.menuTheme = val === 0 ? 'global' : (val === 1 ? 'light' : 'dark')
})
const refButton = ref<ComponentPublicInstance>()

const execAnimate = () => {
  if (timeout) {
    clearTimeout(timeout)
  }
  const time = (Math.floor(Math.random() * 10 + 1) + 10) * 1000
  timeout = setTimeout(() => {
    if (refButton.value) {
      animate(refButton.value.$el, 'bounce')
    }
    execAnimate()
  }, time)
}

onMounted(() => {
  execAnimate()
})
onBeforeUnmount(() => {
  if (timeout) clearTimeout(timeout)
})

</script>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  top: 340px;
  right: -20px;
  z-index: 999;
  box-shadow: 1px 1px 18px #ee44aa;

  .v-icon {
    margin-left: -18px;
    font-size: 1.3rem;
  }

  .fa-spin {
    animation: spin 2s infinite linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
