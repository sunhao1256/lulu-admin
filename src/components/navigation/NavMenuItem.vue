<template>
  <div>
    <v-list-item
      v-if="!(menuItem.children && menuItem.children.length>0)"
      :to="menuItem.routePath"
      density="comfortable"
      active-color="primary"
      link
    >
      <template v-slot:prepend>
        <v-icon :size="small?'x-small':'default'"
                :class="{  'same-size':small }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </template>
      <v-list-item-title>
        {{ $t(menuItem.label) }}
      </v-list-item-title>
    </v-list-item>

    <v-list-group
      v-else
      active-color="primary"
    >

      <template v-slot:activator="{ props }">

        <v-list-item density="comfortable" v-bind="props"
                     :title="$t(menuItem.label)">

          <template v-slot:prepend>
            <v-icon :size="small?'x-small':'default'" :class="{'same-size':small}">
              {{ menuItem.icon || 'mdi-circle-medium' }}
            </v-icon>
          </template>
        </v-list-item>
      </template>

      <slot></slot>
    </v-list-group>
  </div>
</template>

<script lang="ts" setup>
import {PropType} from "vue";

defineProps({
  menuItem: {
    type: Object as PropType<App.GlobalMenuOption>,
    default: () => {
    }
  },
  subgroup: {
    type: Boolean,
    default: false
  },
  small: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/settings';

.same-size {
  width: calc(var(--v-icon-size-multiplier) * #{map.get(settings.$icon-sizes, 'default')});
}

.v-list-group :deep(.v-list-item ) {
  padding-inline-start: settings.$spacer !important;
}
</style>
