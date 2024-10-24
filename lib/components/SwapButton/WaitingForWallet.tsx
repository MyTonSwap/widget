import { ImSpinner8 } from "react-icons/im";
import { useThemeStore } from "../../store/theme.store";
import { IoClose } from "react-icons/io5";
import { ModalState, useSwapStore } from "../../store/swap.store";
import "./WaitingForWallet.scss";
import { motion } from "framer-motion";
import { useOptionsStore } from "../../store/options.store";

const WaitingForWallet = () => {
    const { tonConnectInstance } = useOptionsStore();
    const { setModalState } = useSwapStore();

    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    const { colors } = useThemeStore();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="waiting-for-wallet-container"
            style={{ color: colors.text_black }}
        >
            <IoClose onClick={handleCloseModal} className="close-button" />

            <div className="loading-icon-container">
                <ImSpinner8 className="animate-spin icon" />
            </div>
            <div className="loading-text">
                Confirm the transaction in{" "}
                {tonConnectInstance?.wallet?.device.appName ?? "your Wallet"}
            </div>
            <p>It will only take a moment</p>
        </motion.div>
    );
};

export default WaitingForWallet;
