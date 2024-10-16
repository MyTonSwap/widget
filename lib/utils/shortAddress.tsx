import { address } from "@ton/ton";

export default function shortAddress(
    addressRaw: string,
    network: "testnet" | "mainnet",
    letter_count: number
) {
    const addressConverted = address(addressRaw).toString({
        bounceable: false,
        testOnly: network === "testnet",
    });

    return (
        addressConverted.substring(0, letter_count) +
        "..." +
        addressConverted.substring(addressConverted.length - letter_count)
    );
}
