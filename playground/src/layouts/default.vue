<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { version } from '../../../package.json'
import routesMeta from '~routes/meta'

const route = useRoute()

const pages = computed(() => {
  return routesMeta.filter(meta => !!meta.title).sort((a, b) => {
    if (a.title < b.title)
      return -1
    if (a.title > b.title)
      return 1
    return 0
  })
})

const current = computed(() => {
  return routesMeta.find(meta => route.name === meta.name)
})

const copied = ref(false)
const npm = ref<HTMLElement>()

async function copyIt() {
  try {
    await navigator.clipboard.writeText(npm.value?.innerHTML || '')
    copied.value = true
  }
  catch (error) {
    console.error('Failed to copy: ', error)
  }
  finally {
    copied.value !== false && setTimeout(() => copied.value = false, 2500)
  }
}
</script>

<template>
  <div w-full h-full min-h-full all:transition-300>
    <header flex items-center justify-between px-8 h-16 ring-1 ring-zinc-100>
      <h1 flex="~ items-center" select-none>
        <a href="/" font-bold>
          vite-plugin-vue-routes-generate
        </a>
      </h1>

      <div flex="~ row gap-3 items-center" c-gray bg-zinc-100 font-mono text-xs p-x-4 p-y-2 rounded-4>
        <code ref="npm">pnpm i -D vite-plugin-vue-routes-generate</code>
        <div cursor-pointer :class="copied ? 'i-carbon-checkmark c-green' : 'i-carbon-copy'" @click="copyIt" />
      </div>

      <div flex="~ row items-center">
        <span text-sm mx text-gray>v{{ version }}</span>
        <a href="https://github.com/moujinet/vite-plugin-vue-routes-generate" target="_blank">
          <div i-carbon-logo-github color-gray-6 text-xl hover:color-black />
        </a>
      </div>
    </header>

    <section flex="~" mx-8 my-4 ring ring-inset ring-zinc-1>
      <aside w-60 ring ring-inset ring-zinc-1>
        <div flex="~ row items-center" border="b zinc-1" px-6 py-4 text-gray>
          <div align-middle w-4 h-4 mt-.3 absolute i-carbon-search />
          <input type="text" w-full focus:outline-0 indent-md placeholder="Search">
        </div>
        <div px-3 py-3>
          <template v-for="page in pages" :key="page.name">
            <a :href="page.path" :title="page.title">
              <div flex="~ row items-center gap-2" py-2 px-4 rounded :class="current.name === page.name && 'bg-zinc-100'">
                <div w-4 h-4 mt-.23 color-gray i-carbon-arrow-right :class="current.name === page.name && 'color-accent!'" />
                {{ page.title }}
              </div>
            </a>
          </template>
        </div>
      </aside>
      <main flex-1>
        <div flex="~ row items-center gap-4" border="b zinc-1" px-6 py-4 text-gray>
          <div i-carbon-flag align-middle w-4 h-4 mt-.75 />
          <span>{{ current.file }}</span>
        </div>
        <div px-6 py-3 text-sm leading-6 color-dark>
          <RouterView />
        </div>
      </main>
    </section>
    <footer text-center text-coolgray pb-4 text-xs>
      Released under the MIT License. <br>Copyright &copy; 2022-PRESENT mouji.net
    </footer>
  </div>
</template>

<route>
{
  "layout": true
}
</route>
