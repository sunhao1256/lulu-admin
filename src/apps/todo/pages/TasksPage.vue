<template>
  <todo-list :tasks="incompleteTasks" @edit-task="$emit('edit-task', $event)"/>
</template>

<script setup lang="ts">
import {useTodoStore} from "@/apps/todo/store";

const {incompleteTasks} = storeToRefs(useTodoStore())
</script>
