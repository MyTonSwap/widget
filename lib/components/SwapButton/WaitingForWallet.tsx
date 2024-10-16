import { useTonWallet } from "@tonconnect/ui-react";
import { ImSpinner8 } from "react-icons/im";
import { useThemeStore } from "../../store/theme.store";
import { IoClose } from "react-icons/io5";
import { ModalState, useSwapStore } from "../../store/swap.store";

const WaitingForWallet = () => {
    const wallet = useTonWallet();
    const { setModalState } = useSwapStore();

    const handleCloseModal = () => {
        setModalState(ModalState.NONE);
    };
    const { colors } = useThemeStore();
    return (
        <div
            className="h-full relative flex items-center justify-center flex-col px-4"
            style={{ color: colors.text_black }}
        >
            <IoClose
                onClick={handleCloseModal}
                className=" absolute right-4 top-4 text-xl opacity-70 cursor-pointer"
            />

            <div className="w-full flex items-center justify-center scale-150 text-3xl">
                <ImSpinner8 className="animate-spin opacity-70" />
            </div>
            <div className="text-xl font-bold text-center mt-4">
                Confirm the transaction in {wallet?.device.appName}
            </div>
            <p>It will only take a moment</p>
        </div>
    );
};

export default WaitingForWallet;
