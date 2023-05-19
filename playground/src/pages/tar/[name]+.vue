<script lang="ts" setup>
defineProps<{ name: string }>()
</script>

<template>
  <div>
    This is A {{ name }}Page
  </div>
</template>

<route>
{
  "meta": {
    "layout": "default"
  }
}
</route>
