<script lang="ts" setup>
defineProps<{ foo: string }>()
</script>

<template>
  <div>
    This is A Foo Page

    <p v-if="foo">
      foo say {{ foo }}
    </p>
  </div>
</template>

<route>
{
  "meta": {
    "layout": "default"
  }
}
</route>
