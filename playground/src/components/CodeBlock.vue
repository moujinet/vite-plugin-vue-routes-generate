<script lang="ts" setup>
defineOptions({
  name: 'CodeBlock',
})
</script>

<template>
  <div bg-dark-1 rounded-2 overflow-hidden>
    <div flex="~ items-center" h-10 bg-dark-3>
      <div flex="~ items-center gap-1" ml-4>
        <div rounded-full h-3 w-3 bg-red-400 />
        <div rounded-full h-3 w-3 bg-yellow-500 />
        <div rounded-full h-3 w-3 bg-green-500 />
      </div>
    </div>

    <div ml-8 bg-dark-2 color-gray p-4>
      <slot>
        This is a Vue component Demo.
      </slot>
    </div>
  </div>
</template>
