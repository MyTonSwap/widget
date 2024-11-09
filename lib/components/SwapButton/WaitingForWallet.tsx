import { ImSpinner8 } from "react-icons/im";
import { IoClose } from "react-icons/io5";
import { ModalState, useSwapStore } from "../../store/swap.store";
import "./WaitingForWallet.scss";
import { motion } from "framer-motion";
import { useOptionsStore } from "../../store/options.store";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";

const WaitingForWallet = () => {
    const { t } = useTranslation();
    const { tonConnectInstance } = useOptionsStore();
    const { setModalState } = useSwapStore();

    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="waiting-for-wallet-container"
        >
            <IoClose onClick={handleCloseModal} className="close-button" />

            <div className="loading-icon-container">
                <ImSpinner8 className="animate-spin icon" />
            </div>
            <div className="loading-text">
                <Trans
                    i18nKey={"confirm.confirm_in_wallet"}
                    values={{
                        wallet: tonConnectInstance?.wallet?.device.appName,
                    }}
                ></Trans>
            </div>
            <p>{t("confirm.action_in_progress")}</p>
        </motion.div>
    );
};

export default WaitingForWallet;
