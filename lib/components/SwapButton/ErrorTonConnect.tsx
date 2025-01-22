import { ModalState, useSwapStore } from '../../store/swap.store';
import { IoCloseCircle } from 'react-icons/io5';
import Close from '../icons/Close';

const ErrorTonConnect = () => {
    const { transactionError, transactionErrorBody, setModalState } =
        useSwapStore();
    const handleCloseModal = () => {
        useSwapStore.setState({
            transactionError: null,
            transactionErrorBody: null,
        });
        setModalState(ModalState.NONE);
    };
    return (
        <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-h-full mts-text-black dark:mts-text-white">
            <button onClick={handleCloseModal}>
                <Close className="mts-absolute mts-top-4 mts-right-4 mts-opacity-70 mts-cursor-pointer mts-text-2xl" />
            </button>
            <div className="mts-h-20 mts-w-20 mts-flex mts-justify-center mts-items-center mts-border-[1px] mts-border-zinc-200 mts-bg-zinc-100 mts-rounded-full dark:mts-bg-zinc-800 dark:mts-border-zinc-700">
                <IoCloseCircle className="mts-text-red-500 mts-text-6xl" />
            </div>
            <div className="mts-mt-4 mts-px-7 mts-text-center mts-min-h-52 mts-m-6 mts-flex mts-flex-col mts-items-center mts-justify-center">
                <p className="mts-font-bold mts-text-lg">{transactionError}</p>
                <p>{transactionErrorBody}</p>
            </div>
        </div>
    );
};

export default ErrorTonConnect;
