# MyTonSwap Widget Example

**Widget example for plain html using CDN**

```html
<!DOCTYPE html>
<html lang="en" class="mts-dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js"></script>
    <script type="module"
        src="https://cdn.jsdelivr.net/npm/@mytonswap/widget@latest/dist/cdn/mytonswap-widget.js"></script>
    <style>

    </style>
</head>

<body>
    <div id="swap-widget"></div>
    <script>
        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://mytonswap.com/wallet/manifest.json',
        });
        createSwap("swap-widget", { tonConnectInstance: tonConnectUI });
    </script>
    </script>
</body>

</html>
```