import { useTonWallet } from "@tonconnect/ui-react";
import { ImSpinner8 } from "react-icons/im";
import { useThemeStore } from "../../store/theme.store";
import { IoClose } from "react-icons/io5";
import { ModalState, useSwapStore } from "../../store/swap.store";
import "./WaitingForWallet.scss";
import { motion } from "framer-motion";

const WaitingForWallet = () => {
    const wallet = useTonWallet();
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
                Confirm the transaction in {wallet?.device.appName}
            </div>
            <p>It will only take a moment</p>
        </motion.div>
    );
};

export default WaitingForWallet;
