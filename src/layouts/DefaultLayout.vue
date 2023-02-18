<template>
  <!-- Navigation -->
  <v-navigation-drawer
    v-model="drawer"
    floating
    :theme="theme.menuTheme"
    class="elevation-1"
  >

    <!-- Navigation menu info -->
    <div class="pa-2">
      <div class="title font-weight-bold text-uppercase text-primary">{{ name }}</div>
      <div class="overline text-grey">{{ version }}</div>
    </div>

    <!-- Navigation menu -->
    <div class="py-1">
      <main-menu :menu="menus"/>
    </div>

    <!-- Navigation menu footer -->
    <template v-slot:append>
      <!-- Footer navigation links -->
      <div class="py-2 text-center">
        <v-btn size="small"
               :href="'https://next.vuetifyjs.com/en/'"
               flat
        >
          {{ $t('menu.docs') }}
        </v-btn>
      </div>

    </template>
  </v-navigation-drawer>


  <side-config-menu/>
  <!-- Toolbar -->
  <v-app-bar
    class="overflow-visible px-2"
    :theme="theme.toolbarTheme === 'global'? undefined :theme.toolbarTheme"
    :flat="theme.isToolbarDetached"
    :color="theme.isToolbarDetached?'background':undefined"
  >
    <v-card class="flex-grow-1 d-flex" :class="[theme.isToolbarDetached? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
            :flat="!theme.isToolbarDetached"
    >
      <div class="d-flex flex-grow-1 align-center">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer class="d-none d-lg-block"/>
        <v-autocomplete
          :placeholder="$t('menu.search')"
          prepend-inner-icon="mdi-magnify"
          hide-details
          :items="routeStore.searchMenus"
          item-title="meta.title"
          clearable
          variant="filled"
          density="comfortable"
          v-model="selectMenu"
          class="v-text-field-rounded"
          single-line
        >
        </v-autocomplete>
        <v-spacer class="d-none"/>
        <toolbar-language/>
        <div class="mr-1">
          <toolbar-notifications/>
        </div>
        <toolbar-user/>
      </div>
    </v-card>
  </v-app-bar>

  <v-main>
    <loading-progress-provider>
      <v-container :fluid="!theme.isContentBoxed" class="h-100">
        <v-layout class="h-100 position-static">
          <router-view v-slot="{ Component }">
            <v-fade-transition mode="out-in">
              <component :is="Component"/>
            </v-fade-transition>
          </router-view>
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline">
          Built with
          <v-icon small color="pink">mdi-heart</v-icon>
          <a class="text-decoration-none" href="https://github.com/sunhao1256/lulu-admin" target="_blank">@lulu</a>
        </div>
      </v-footer>
    </loading-progress-provider>
  </v-main>
</template>

<script setup lang="ts">

import LoadingProgressProvider from "@/components/provider/LoadingProgressLine";
import {computed} from 'vue'
import {useAppInfo} from "@/composables";
const store = useAppStore()
const {theme} = storeToRefs(store)
const drawer = ref(true)
const routeStore = useRouteStore();
const menus = computed(() => routeStore.menus as App.GlobalMenuOption[]);

const {name, version} = useAppInfo();

const selectMenu = ref()


</script>

<style scoped>
.v-text-field-rounded :deep(.v-field__input) {
  flex-direction: column;
  justify-content: center;
}
</style>