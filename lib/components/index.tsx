import { Swap, SwapProps } from "./Swap/Swap";
import { createRoot } from "react-dom/client";
export const createSwap = (elementId: string, options: SwapProps) => {
    const root = document.getElementById(elementId);
    if (!root) throw new Error("Element does not exist");
    createRoot(root).render(<Swap {...options} />);
};
