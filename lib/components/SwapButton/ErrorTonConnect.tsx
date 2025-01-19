import { ModalState, useSwapStore } from '../../store/swap.store';
import { IoClose } from 'react-icons/io5';
import { IoCloseCircle } from 'react-icons/io5';

const ErrorTonConnect = () => {
    const { transactionError, transactionErrorBody, setModalState } =
        useSwapStore();
    const handleCloseModal = () => {
        useSwapStore.setState({
            transactionError: null,
            transactionErrorBody: null,
        });
        // close modal
        setModalState(ModalState.NONE);
    };
    return (
        <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-h-full mts-text-black">
            <IoCloseCircle className="mts-text-red-500 mts-text-6xl" />
            <IoClose
                onClick={handleCloseModal}
                className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-xl"
            />
            <div className="mts-mt-4 mts-px-7 mts-text-center">
                <p className="mts-font-bold mts-text-xl">{transactionError}</p>
                <p>{transactionErrorBody}</p>
            </div>
        </div>
    );
};

export default ErrorTonConnect;
