# MyTonSwap Widget

`@mytonswap/widget` is a customizable React component that enables developers to integrate swap functionality on the TON blockchain directly into their React applications. With this widget, users can seamlessly swap assets and connect to the TON blockchain via TonConnect.

## Features

- **Swap Functionality**: Easily swap assets on the TON blockchain.
- **TonConnect Integration**: Connect to the TON blockchain through TonConnect for secure and convenient user authentication.
- **Easy Integration**: Add and configure the widget in your React project effortlessly.
- **Responsive Design**: The widget is optimized for different devices and screen sizes.
- **Customizable**: Adapt the widget’s appearance to match your application’s style.

## Installation

Install the widget using npm or yarn:

```bash
# Using npm
npm install @mytonswap/widget

# Using yarn
yarn add @mytonswap/widget
```
## Usage

After installation, you can integrate the `@mytonswap/widget` components in your React app as follows:

```tsx
import "./App.css";
import { Swap, TonConnectWrappedSwap } from "@mytonswap/widget";

function App() {
    return (
        <>
            {/* TonConnect integration if your not using it already */}
            <TonConnectWrappedSwap />
            
            {/* Swap component without TonConnect integration */}
            <Swap />
        </>
    );
}

export default App;
```

### Components
1. TonConnectWrappedSwap:
    - This component is a wrapper for the TonConnect UI component.
2. Swap:
   - This component is the main component that allows users to swap assets on the TON blockchain.


## Contributing

We welcome contributions to improve `@mytonswap/widget`. To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

### License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Support
For issues or questions, feel free to open an issue on our [GitHub repository](https://github.com/mytonswap/widget/issues).