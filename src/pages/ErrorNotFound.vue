<template>
  <div class="fullscreen bg-primary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        {{ $t('error_404') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        rounded
        text-color="primary"
        unelevated
        :to="{ name: 'me' }"
        :label="$t('btn_back_home')"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>
