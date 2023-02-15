<template>
  <div class="d-flex flex-grow-1 flex-row mt-2">
    <v-navigation-drawer
      v-model="drawer"
      permanent
      class="elevation-1 rounded flex-shrink-0 mr-3 position-relative"
      width="240"
    >
      <todo-menu class="todo-app-menu pa-2" @open-compose="openCompose"></todo-menu>
    </v-navigation-drawer>

    <div class="d-flex flex-grow-1 flex-column">
      <router-view class="flex-grow-1"/>
    </div>

    <todo-compose ref="compose"/>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import TodoCompose from '@/apps/todo/components/TodoCompose.vue'

const drawer = ref()
const compose = ref<InstanceType<typeof TodoCompose> | null>()
const openCompose = (task: Todo.Task) => {
  compose.value?.open(task)
}

</script>
