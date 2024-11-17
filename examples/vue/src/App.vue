<script setup lang="ts">
import { createSwap } from "@mytonswap/widget"
import { TonConnectUI } from '@tonconnect/ui'
import { onMounted, ref } from 'vue'

const isMounted = ref(false)

onMounted(() => {
  if (!isMounted.value) {
    const tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://mytonswap.com/wallet/manifest.json',
    });
    createSwap("mytonswap-widget", { tonConnectInstance: tonConnectUI })
    isMounted.value = true
  }
})

</script>

<template>
  <div id="mytonswap-widget"></div>
</template>

