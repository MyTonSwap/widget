import { useSwapStore } from "../../store/swap.store";
import { useThemeStore } from "../../store/theme.store";
import Card from "./Card";
import { IoSwapHorizontal } from "react-icons/io5";

const SwapCard = () => {
    const { colors } = useThemeStore();
    const { changeDirection } = useSwapStore();
    return (
        <div
            className="px-3 py-4 mt-2 rounded-2xl w-full flex flex-col items-center gap-y-2"
            style={{ background: colors.light_shade }}
        >
            <Card type="pay" />
            <button
                onClick={() => {
                    changeDirection();
                }}
                className="px-10 py-2 text-lg rounded-full"
                style={{
                    color: colors.text_white,
                    background: colors.primary,
                }}
            >
                <IoSwapHorizontal className="rotate-90" />
            </button>
            <Card type="receive" />
        </div>
    );
};

export default SwapCard;
