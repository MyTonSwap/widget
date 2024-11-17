import "./App.css";
import { useEffect, useRef } from "react";
import { createSwap } from "@mytonswap/widget";
import { useTonConnectUI } from "@tonconnect/ui-react";

function App() {
    const [tc] = useTonConnectUI();
    const initMounted = useRef(false);
    useEffect(() => {
        if (!tc || initMounted.current) return;
        initMounted.current = true;
        if (tc) {
            createSwap("swap-component", {
                tonConnectInstance: tc,
            });
        }
    }, [tc]);

    return (
        <div className="App">
            <div id="swap-component"></div>
        </div>
    );
}

export default App;
