import { CSSProperties, FC, useEffect, useState } from "react";
import { useFavoriteStore } from "../../store/favtorite.store";
import { useSwapStore } from "../../store/swap.store";
import { Asset } from "@mytonswap/sdk";
import Token from "./Token";
import { CgSpinnerTwo } from "react-icons/cg";

type FavListProps = {
    onTokenSelect: (asset: Asset) => void;
};

const FavList: FC<FavListProps> = ({ onTokenSelect }) => {
    const { favList } = useFavoriteStore();
    const { client, addToAssets, assets } = useSwapStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const favItems = assets?.filter((item) => favList.includes(item.address));
    useEffect(() => {
        const getFavAssets = async () => {
            setIsLoading(true);
            try {
                const assets = await client.assets.getAssets(favList);
                addToAssets(assets);
            } catch (error) {
                console.log(error);
                setIsError(true);
            }
            setIsLoading(false);
        };
        getFavAssets();
    }, []);
    return (
        <div
            className="dialog-tokens-container"
            style={{
                ...({
                    "--thumb-scrollbar": `var(--primary-color)`,
                } as CSSProperties),
            }}
            id="scroll-div"
        >
            {favItems?.map((token) => (
                <Token
                    asset={token}
                    onTokenSelect={onTokenSelect}
                    key={token.address}
                />
            ))}
            {isLoading && (
                <div className="infinite-scroll-loading">
                    <CgSpinnerTwo className="animate-spin" />
                </div>
            )}
            {isError && (
                <div className="infinite-scroll-loading">
                    <div>Something went wrong...</div>
                </div>
            )}
            {!isLoading && !isError && favItems?.length === 0 && (
                <div className="infinite-scroll-loading">
                    <div className="fav-no-item">No favorite tokens</div>
                </div>
            )}
        </div>
    );
};

export default FavList;
