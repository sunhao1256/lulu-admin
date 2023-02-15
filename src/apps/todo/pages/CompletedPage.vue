<template>
  <todo-list :tasks="completeTasks" @edit-task="$emit('edit-task', $event)"/>
</template>

<script lang="ts" setup>
import {useTodoStore} from "@/apps/todo/store";

const {completeTasks} = storeToRefs(useTodoStore())

</script>
