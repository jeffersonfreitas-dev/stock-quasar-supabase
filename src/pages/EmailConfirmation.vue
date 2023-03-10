<template>
  <q-page padding>
    <p class="text-body1">{{ $t('thanks_registration') }}</p>
    <p class="text-body1">{{ $t('msg_confirm_email') }}<strong> {{ $route.query.email }} </strong></p>
    <div class="row justify-center">
      <div class="col-md-4 col-sn-6 col-xs-10 q-gutter-y-md">
        <q-btn
          :label="$t('btn_back_login')"
          color="primary"
          class="full-width"
          rounded
          :to="{ name: 'login' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageEmailConfirmation'
})
</script>
