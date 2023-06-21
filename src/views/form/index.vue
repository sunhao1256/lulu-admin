<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="text-h4">Forms</div>
        <breadcrumb/>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="text-capitalize" color="primary" to="/form/design">
        Create Form
      </v-btn>
    </div>

    <form-list/>
  </div>
</template>

<script setup lang="ts">
import FormList from "@/views/form/list.vue";
</script>

<style scoped>

</style>
