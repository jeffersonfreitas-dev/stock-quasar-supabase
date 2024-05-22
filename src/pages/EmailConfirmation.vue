<template>
  <q-page padding>
    <div class="row justify-center">
      <h3>StockSet</h3>
    </div>
    <p class="text-body1">{{ $t('thanks_registration') }}</p>
    <p class="text-body1 q-mb-lg">{{ $t('msg_confirm_email') }}<strong> {{ $route.query.email }} </strong></p>
    <div class="row justify-center q-mt-lg">
      <div class="col-md-8 col-sm-8 col-xs-10 q-gutter-y-md">

        <div class=" row justify-center">
          <q-btn align="around"
            class="btn-fixed-width q-py-md"
            icon="logout"
            color="primary"
            :label="$t('btn_back_login')"
            :to="{ name: 'login' }"
            />
        </div>
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
