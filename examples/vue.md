# MyTonSwap Widget Example

**Widget example for plain html using package manager**

## Install using a package manager
```
npm i @mytonswap/widget
```

# Use it in your app

`your-component.vue`
```vue
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
```
`global.css`
```css
:root {
    --border-color: #f4f4f5;
    --primary-color: #22c55e;
    --background-color: #ffffff;
    --input-card-color: #ffffff;
    --input-token-color: #f4f4f5;
    --light-shade-color: #f4f4f5;
    --slippage-box-color: #71717a;
    --text-black-color: #000000;
    --text-white-color: #ffffff;
    --text-fade-color: #9caacb;
    --skeleton-shine-color: #9c9c9c;
    --price-impact-color: #e64646;
}
```