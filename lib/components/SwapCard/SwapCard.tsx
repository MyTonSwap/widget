import { useSwapStore } from "../../store/swap.store";
import Card from "./Card";
import { IoSwapHorizontal } from "react-icons/io5";
import "./SwapCard.scss";
import { useOptionsStore } from "../../store/options.store";
const SwapCard = () => {
    const { changeDirection } = useSwapStore();
    const { options } = useOptionsStore();

    const shouldShowChangeDirection =
        options.ui_preferences?.show_change_direction;
    return (
        <div className="swap-card-container">
            <Card type="pay" />
            {shouldShowChangeDirection && (
                <button
                    onClick={() => {
                        changeDirection();
                    }}
                    className="change-direction-button"
                    data-testid="change-direction-button"
                >
                    <IoSwapHorizontal className="rotate-90" />
                </button>
            )}
            <Card type="receive" />
        </div>
    );
};

export default SwapCard;
