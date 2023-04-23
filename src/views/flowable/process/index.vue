<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">Flows</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" color="primary" to="/flowable/design">
        Create Flow
      </v-btn>
    </div>
    <v-tabs :show-arrows="false" background-color="transparent" color="primary" class="my-2">
      <v-tab to="/flowable/processes/list">List</v-tab>
      <v-tab to="/flowable/processes/preview">Preview</v-tab>
    </v-tabs>
    <v-window>
      <router-view v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component"/>
        </v-fade-transition>
      </router-view>
    </v-window>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
</style>
