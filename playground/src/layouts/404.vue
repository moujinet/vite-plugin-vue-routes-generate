<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main p="x4 y10" text="center text-gray">
    <div text-4xl p-b-8>
      <div i-carbon-warning-alt-filled inline-block />
    </div>
    <RouterView />
    <div>
      <button text-sm m="3 t8" @click="router.back()">
        Back
      </button>
    </div>
  </main>
</template>

<route>
{
  "layout": true
}
</route>
