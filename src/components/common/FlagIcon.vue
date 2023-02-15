<template>
  <span class="fi" :class="[`fi-${flag}`, { 'flag-round': round }]"></span>
</template>

<script setup lang="ts">
import "flag-icons/css/flag-icons.min.css"

defineProps(
  {
    // Country ISO
    flag: {
      type: String,
      default: 'us'
    },
    // Circle flag or square
    round: {
      type: Boolean,
      default: false
    }
  }
)

</script>

<style lang="scss" scoped>
.fi {
  height: 22px;
  width: 22px;

  &.flag-round {
    background-size: cover;
    border-radius: 100%;
    height: 26px;
    width: 26px;
  }
}
</style>
