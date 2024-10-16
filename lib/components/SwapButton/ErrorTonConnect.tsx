import { ModalState, useSwapStore } from "../../store/swap.store";
import { useThemeStore } from "../../store/theme.store";
import { IoClose } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";

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
        <div
            className="flex items-center justify-center flex-col h-full"
            style={{ color: colors.text_black }}
        >
            <IoCloseCircle className="text-yellow-500 text-[40px]" />
            <IoClose
                onClick={handleCloseModal}
                className=" absolute right-4 top-4 text-xl opacity-70 cursor-pointer"
            />
            <div className="text-center px-7">
                <h1 className="text-xl font-bold">{transactionError}</h1>
                <p>{transactionErrorBody}</p>
            </div>
        </div>
    );
};

export default ErrorTonConnect;
