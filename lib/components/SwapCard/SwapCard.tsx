import { useSwapStore } from "../../store/swap.store";
import { useThemeStore } from "../../store/theme.store";
import Card from "./Card";
import { IoSwapHorizontal } from "react-icons/io5";
import "./SwapCard.scss";
const SwapCard = () => {
    const { colors } = useThemeStore();
    const { changeDirection } = useSwapStore();
    return (
        <div
            className="swap-card-container"
            style={{ background: colors.light_shade }}
        >
            <Card type="pay" />
            <button
                onClick={() => {
                    changeDirection();
                }}
                className="change-direction-button"
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
