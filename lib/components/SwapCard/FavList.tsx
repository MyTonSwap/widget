import { CSSProperties, FC, useEffect, useState } from 'react';
import { useFavoriteStore } from '../../store/favtorite.store';
import { useSwapStore } from '../../store/swap.store';
import { Asset } from '@mytonswap/sdk';
import Token from './Token';
import { CgSpinnerTwo } from 'react-icons/cg';

type FavListProps = {
    onTokenSelect: (asset: Asset) => void;
    type: 'pay' | 'receive';
};

const FavList: FC<FavListProps> = ({ onTokenSelect, type }) => {
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
            className="mts-flex-grow mts-h-50vh mts-overflow-y-scroll"
            style={{
                ...({
                    '--thumb-scrollbar': `var(--mts-primary-500)`,
                } as CSSProperties),
            }}
            id="scroll-div"
        >
            {favItems?.map((token) => (
                <Token
                    type={type}
                    asset={token}
                    onTokenSelect={onTokenSelect}
                    key={token.address}
                />
            ))}
            {isLoading && (
                <div className="mts-flex mts-justify-center mts-items-center mts-h-10 mts-text-black mts-text-xl">
                    <CgSpinnerTwo className="mts-animate-spin mts-text-primary-500" />
                </div>
            )}
            {isError && (
                <div className="mts-flex mts-justify-center mts-items-center mts-h-10 mts-text-black mts-text-xl">
                    <div>Something went wrong...</div>
                </div>
            )}
            {!isLoading && !isError && favItems?.length === 0 && (
                <div className="mts-flex mts-justify-center mts-items-center mts-h-10 mts-text-black mts-text-xl">
                    <div className="mts-opacity-70 mts-text-xs">
                        No favorite tokens
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavList;
