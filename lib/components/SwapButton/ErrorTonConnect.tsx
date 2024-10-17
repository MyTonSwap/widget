import { ModalState, useSwapStore } from "../../store/swap.store";
import { useThemeStore } from "../../store/theme.store";
import { IoClose } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";
import "./ErrorTonConnect.scss";
const ErrorTonConnect = () => {
    const { transactionError, transactionErrorBody, setModalState } =
        useSwapStore();
    const { colors } = useThemeStore();
    const handleCloseModal = () => {
        useSwapStore.setState({
            transactionError: null,
            transactionErrorBody: null,
        });
        // close modal
        setModalState(ModalState.NONE);
    };
    return (
        <div className="error-container" style={{ color: colors.text_black }}>
            <IoCloseCircle className="icon" />
            <IoClose onClick={handleCloseModal} className=" close-button" />
            <div className="text">
                <p className="title">{transactionError}</p>
                <p>{transactionErrorBody}</p>
            </div>
        </div>
    );
};

export default ErrorTonConnect;
