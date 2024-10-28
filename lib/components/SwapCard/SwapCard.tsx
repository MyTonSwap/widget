import { useSwapStore } from "../../store/swap.store";
import { useThemeStore } from "../../store/theme.store";
import Card from "./Card";
import { IoSwapHorizontal } from "react-icons/io5";
import "./SwapCard.scss";
import { useOptionsStore } from "../../store/options.store";
const SwapCard = () => {
    const { colors } = useThemeStore();
    const { changeDirection } = useSwapStore();
    const { options } = useOptionsStore();

    const shouldShowChangeDirection =
        options.ui_preferences?.show_change_direction;
    return (
        <div
            className="swap-card-container"
            style={{ background: colors.light_shade }}
        >
            <Card type="pay" />
            {shouldShowChangeDirection && (
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
            )}
            <Card type="receive" />
        </div>
    );
};

export default SwapCard;
