import clsx from 'clsx';
import {
    CSSProperties,
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import Token from './Token';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSwapStore } from '../../store/swap.store';
import { Asset } from '@mytonswap/sdk';
import sortAssets from '../../utils/sortAssets';
import { CgSpinnerTwo } from 'react-icons/cg';
import { address } from '@ton/ton';
import './CardDialog.scss';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { modalAnimationDesktop, modalAnimationMobile } from '../../constants';
import catchError from '../../utils/catchErrors';

import { reportErrorWithToast } from '../../services/errorAnalytics';
import { useTranslation } from 'react-i18next';
import FavList from './FavList';
import Close from '../icons/Close';
import Search from '../icons/Search';
import Warning from '../icons/Warning';
type CardDialogProps = {
    isSelectVisible: boolean;
    setIsSelectVisible: Dispatch<SetStateAction<boolean>>;
    type: 'pay' | 'receive';
    onTokenSelect: (asset: Asset) => void;
};

enum TABS {
    ALL = 'ALL',
    FAVORITES = 'FAVORITES',
}

const CardDialog: FC<CardDialogProps> = ({
    isSelectVisible,
    setIsSelectVisible,
    onTokenSelect,
    type,
}) => {
    const { t } = useTranslation();
    const {
        client,
        addToAssets,
        assets,
        pay_token,
        communityTokens,
        isInAgreedTokens,
        addToken,
        pinnedTokens,
    } = useSwapStore();
    const [receiveAssets, setReceiveAssets] = useState<Asset[]>([]);
    const [activeTab, setActiveTab] = useState<TABS>(TABS.ALL);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [contractCommunity, setContractCommunity] = useState<Asset | null>(
        null
    );
    const [promptForCommunity, setPromptForCommunity] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const ref = useRef(null);
    const onNextPage = async (currPage: number) => {
        if (type === 'pay') {
            const result = await catchError(() =>
                client.assets.getPaginatedAssets(
                    currPage,
                    communityTokens,
                    searchInput
                )
            );
            if (result.error) {
                reportErrorWithToast(
                    result.error,
                    'Failed to fetch assets',
                    'CardDialog.tsx onNextPage pay :86'
                );
                return;
            }
            console.log(result);
            const { assets, meta } = result.data;
            setPage(currPage + 1);
            addToAssets(assets);
            setHasMore(!meta.isLastPage);
            return;
        }
        if (type === 'receive' && !pay_token) return;
        if (type === 'receive') {
            const newAssets = await catchError(() =>
                client.assets.getPairs(
                    pay_token!.address,
                    currPage,
                    communityTokens,
                    searchInput
                )
            );
            if (newAssets.error) {
                reportErrorWithToast(
                    newAssets.error,
                    'Failed to fetch assets',
                    'CardDialog.tsx onNextPage receive :105'
                );
                return;
            }
            const { assets, meta } = newAssets.data;
            setPage(currPage + 1);
            setReceiveAssets((prev) => {
                const mergedAssets = [...prev, ...assets];

                // Filter to keep unique assets based on the 'address' property
                const uniqueAssets = mergedAssets.filter(
                    (asset, index, self) =>
                        index ===
                        self.findIndex((a) => a.address === asset.address)
                );

                return uniqueAssets;
            });
            if (assets.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(!meta.isLastPage);
            }
        }
    };
    useEffect(() => {
        if (pay_token && type === 'pay') {
            return;
        }

        setPage(1);
        setHasMore(true);
        setReceiveAssets([]);
        onNextPage(1);
    }, [pay_token, communityTokens]);

    // useEffect(() => {
    //     setPage(1);
    //     setHasMore(true);
    //     setReceiveAssets([]);
    // }, []);

    const isInitMount = useRef(true);
    useEffect(() => {
        if (isInitMount.current) {
            isInitMount.current = false;
        } else {
            setPage(1);
            setHasMore(true);
            setReceiveAssets([]);
            onNextPage(1);
        }
    }, [searchInput]);

    const assetList = type === 'pay' ? assets : receiveAssets;

    const handleOnTokenSelect = (asset: Asset) => {
        if (!communityTokens && asset.warning) {
            setContractCommunity(asset);
            setPromptForCommunity(true);
        }
        if (promptForCommunity) {
            setPromptForCommunity(false);
        }
        setSearchInput('');
        onTokenSelect(asset);
        setPage(1);
        setHasMore(true);
        setReceiveAssets([]);
        onNextPage(1);
    };

    const filteredAssets =
        assetList
            ?.sort(sortAssets)
            .filter((item) => {
                const searchValue = searchInput.toLowerCase();

                if (searchValue === 'usdt' && item.symbol === 'USD₮') {
                    return true;
                }

                let addressSearch = '';
                try {
                    addressSearch = address(searchInput).toString({
                        bounceable: true,
                    });
                } catch {
                    // Ignore invalid address
                }

                return (
                    item.name.toLowerCase().includes(searchValue) ||
                    item.symbol.toLowerCase().includes(searchValue) ||
                    (addressSearch.length > 0 &&
                        item.address.includes(addressSearch))
                );
            })
            .filter((item) => (communityTokens ? true : !item.warning)) || [];

    const handleOnClose = () => {
        setIsSelectVisible(false);
        setSearchInput('');
    };

    useEffect(() => {
        try {
            const addr = address(searchInput).toString({
                bounceable: true,
            });

            const getToken = async () => {
                const assetByAddrResult = await catchError(() =>
                    client.assets.getExactAsset(addr)
                );
                if (assetByAddrResult.error) {
                    reportErrorWithToast(
                        assetByAddrResult.error,
                        'Failed to fetch asset',
                        'CardDialog.tsx getToken :197'
                    );
                    return;
                }

                const assetByAddr = assetByAddrResult.data;
                if (assetByAddr) {
                    if (
                        assetByAddr.warning &&
                        !isInAgreedTokens(assetByAddr.address)
                    ) {
                        setContractCommunity(assetByAddr);
                        setPromptForCommunity(true);
                    } else {
                        if (promptForCommunity) setPromptForCommunity(false);

                        addToAssets([assetByAddr]);
                    }
                }
            };
            getToken();
        } catch {
            if (promptForCommunity) setPromptForCommunity(false);
        }
    }, [searchInput]);

    const handleClickOutside = () => {
        handleOnClose();
    };

    useOnClickOutside(ref, handleClickOutside);

    const modalAnimation = isDesktop
        ? modalAnimationDesktop
        : modalAnimationMobile;

    return (
        <>
            <AnimatePresence>
                {isSelectVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={clsx(
                            'mts-fixed mts-top-0 mts-left-0 mts-z-[9999999999999999999999999] mts-bg-black/50 mts-w-full mts-h-full mts-overflow-hidden'
                        )}
                    >
                        <motion.div
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            className={clsx(
                                'mts-fixed mts-bottom-0 mts-left-0 mts-flex mts-flex-col mts-shadow-[0px_0px_10px_rgba(0,0,0,0.05)] mts-rounded-t-2xl mts-bg-white dark:mts-bg-zinc-900 mts-p-4 mts-pt-4 mts-pb-2 mts-w-full mts-min-h-[92.5dvh] mts-max-h-[92.5dvh] mts-overflow-y-auto md:mts-shadow-[0_0px_10px_rgba(0,0,0,0.05)] md:mts-rounded-2xl md:mts-w-[90%] md:mts-max-w-[34.375rem] md:mts-h-auto md:mts-min-h-[21.875rem] md:mts-max-h-[70dvh]'
                            )}
                            ref={ref}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="mts-flex mts-justify-between mts-items-center mts-text-black dark:mts-text-white mts-font-bold mts-text-lg">
                                <div>{t('select_a_token')}</div>
                                <button
                                    onClick={handleOnClose}
                                    className="mts-text-black dark:mts-text-white mts-text-2xl md:mts-block"
                                >
                                    <Close />
                                </button>
                            </div>
                            <div>
                                <div className="mts-flex mts-items-center mts-transition-all mts-duration-200 mts-ease-in-out mts-mt-6 mts-mb-2 mts-border mts-border-black/10 mts-rounded-lg mts-bg-white dark:mts-bg-zinc-800 dark:mts-border-zinc-700 mts-px-3 mts-w-full mts-h-10 md:mts-h-14 hover:mts-bg-zinc-100 focus-within:mts-border-primary-500 dark:focus-within:mts-border-primary-500">
                                    <Search className="mts-text-zinc-500 mts-text-lg md:mts-opacity-50" />
                                    <input
                                        className="mts-outline-none mts-bg-transparent mts-px-2 mts-w-full mts-h-full mts-text-black mts-text-sm md:mts-text-sm mts-font-normal"
                                        type="text"
                                        placeholder={t('search')}
                                        data-testid="dialog-search-input"
                                        onChange={(e) => {
                                            setSearchInput(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            {pinnedTokens && (
                                <div className="mts-flex mts-items-center mts-gap-2 mts-py-3">
                                    {pinnedTokens.map((item) => {
                                        return (
                                            <button
                                                className="mts-flex mts-items-center mts-gap-1 mts-opacity-80 mts-transition-all mts-duration-300 mts-ease-in-out mts-cursor-pointer mts-rounded-full mts-bg-zinc-100 dark:mts-bg-zinc-800 mts-p-1 mts-px-2 mts-text-black dark:mts-text-white mts-text-[0.9rem] hover:mts-opacity-100"
                                                onClick={() => {
                                                    handleOnTokenSelect(item);
                                                }}
                                                key={item.address}
                                            >
                                                <div
                                                    className="mts-rounded-full mts-bg-contain mts-w-5 mts-h-5"
                                                    style={{
                                                        background: `url(${item.image}) var(--background-color)`,
                                                    }}
                                                ></div>
                                                <span>{item.symbol}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            {!promptForCommunity && (
                                <>
                                    <div className="mts-flex mts-items-center mts-gap-5 mts-mt-3 mts-mb-2 mts-border-b mts-border-black/10 mts-px-3 mts-pb-2 mts-w-full mts-text-black mts-font-light mts-text-lg">
                                        <button
                                            className={clsx(
                                                'mts-relative mts-transition-all mts-duration-300 mts-ease-in-out mts-bg-transparent mts-text-black dark:mts-text-white mts-text-sm',
                                                activeTab === TABS.ALL &&
                                                    'mts-text-primary-500 mts-font-semibold dark:mts-text-primary-500'
                                            )}
                                            onClick={() =>
                                                setActiveTab(TABS.ALL)
                                            }
                                        >
                                            All
                                            {activeTab === TABS.ALL && (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                    }}
                                                    className="mts-absolute mts-bottom-[-9px] mts-bg-primary-500 mts-w-full mts-h-[1px]"
                                                ></motion.div>
                                            )}
                                        </button>
                                        <button
                                            className={clsx(
                                                'mts-relative mts-transition-all mts-duration-300 mts-ease-in-out mts-bg-transparent mts-text-black dark:mts-text-white mts-text-sm',
                                                activeTab === TABS.FAVORITES &&
                                                    'mts-text-primary-500 mts-font-semibold dark:mts-text-primary-500'
                                            )}
                                            onClick={() =>
                                                setActiveTab(TABS.FAVORITES)
                                            }
                                        >
                                            Favorites
                                            {activeTab === TABS.FAVORITES && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="mts-absolute mts-bottom-[-9px] mts-bg-primary-500 mts-w-full mts-h-[1px]"
                                                ></motion.div>
                                            )}
                                        </button>
                                    </div>
                                    {activeTab === TABS.ALL && (
                                        <div
                                            className="mts-flex-grow mts-h-[50vh] mts-overflow-y-scroll"
                                            style={{
                                                ...({
                                                    '--thumb-scrollbar': `rgb(var(--mts-primary-500))`,
                                                } as CSSProperties),
                                            }}
                                            id="scroll-div"
                                        >
                                            <InfiniteScroll
                                                dataLength={
                                                    filteredAssets.length + page
                                                }
                                                hasMore={hasMore}
                                                next={() => onNextPage(page)}
                                                scrollableTarget="scroll-div"
                                                loader={
                                                    <div className="mts-flex mts-justify-center mts-items-center mts-h-10 mts-text-[1.25rem]">
                                                        <CgSpinnerTwo className="mts-animate-spin mts-text-primary-500" />
                                                    </div>
                                                }
                                                endMessage={
                                                    filteredAssets.length ===
                                                    0 ? (
                                                        <div
                                                            className="mts-flex mts-grow mts-flex-col mts-justify-center mts-items-center mts-mt-4 mts-h-full mts-text-[var(--text-black-color)]"
                                                            data-testid="token-not-found"
                                                        >
                                                            {t(
                                                                'token_notfound'
                                                            )}
                                                            <span className="mts-opacity-70 mts-text-xs">
                                                                {t(
                                                                    'not_found_desc'
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="mts-flex mts-grow mts-flex-col mts-justify-center mts-items-center mts-mt-4 mts-h-full mts-text-[var(--text-black-color)]"
                                                            data-testid="no-more-token"
                                                        >
                                                            {t(
                                                                'no_more_tokens'
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            >
                                                {filteredAssets?.map((item) => (
                                                    <Token
                                                        onTokenSelect={
                                                            handleOnTokenSelect
                                                        }
                                                        asset={item}
                                                        key={item.address}
                                                        type={type}
                                                    />
                                                ))}
                                            </InfiniteScroll>
                                        </div>
                                    )}
                                    {activeTab === TABS.FAVORITES && (
                                        <FavList
                                            type={type}
                                            onTokenSelect={onTokenSelect}
                                        />
                                    )}
                                </>
                            )}
                            {promptForCommunity && (
                                <div className="mts-flex mts-grow mts-flex-col mts-h-full">
                                    {contractCommunity && (
                                        <>
                                            <div className="mts-flex mts-grow mts-flex-col mts-gap-2">
                                                <div className="mts-flex mts-flex-col mts-justify-center mts-items-center mts-mt-1 mts-mb-1 mts-rounded-lg mts-bg-[var(--input-card-color)] mts-p-2 mts-text-[var(--text-black-color)]">
                                                    <div className="mts-h-20 mts-w-20 mts-bg-zinc-100 mts-border-zinc-200 mts-border-[1px] mts-flex mts-items-center mts-justify-center   mts-rounded-full">
                                                        <Warning className="mts-text-red-500 mts-text-4xl " />
                                                    </div>
                                                    <h1 className="mts-font-bold mts-text-lg mts-mt-6 ">
                                                        {t(
                                                            'trade_warning.trade_title'
                                                        )}
                                                    </h1>
                                                    <p className="mts-px-5 mts-text-sm mts-text-center mts-mt-6">
                                                        {t(
                                                            'trade_warning.trade_description'
                                                        )}
                                                    </p>
                                                </div>
                                                <hr className="mts-mt-6 mts-mb-4" />
                                                {contractCommunity && (
                                                    <Token
                                                        asset={
                                                            contractCommunity
                                                        }
                                                        onTokenSelect={() => {}}
                                                        type={type}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                className="mts-flex mts-justify-center mts-items-center mts-rounded-lg mts-w-full mts-h-11 mts-border-[1px] mts-border-primary-600  mts-text-white mts-text-sm mts-bg-primary-500"
                                                onClick={() => {
                                                    addToken(
                                                        contractCommunity!
                                                            .address
                                                    );
                                                    handleOnTokenSelect(
                                                        contractCommunity
                                                    );
                                                }}
                                            >
                                                {t('trade_warning.agree')}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                            <div className="mts-flex mts-justify-center mts-items-center mts-cursor-pointer mts-pt-2 mts-text-sm md:mts-hidden">
                                <button
                                    onClick={handleOnClose}
                                    className="mts-flex mts-justify-center mts-items-center mts-transition-all mts-duration-300 mts-ease-in-out mts-rounded-lg mts-bg-white dark:mts-bg-zinc-800 dark:mts-text-white dark:mts-border-zinc-700 mts-border-zinc-200 mts-border-[1px] mts-w-full mts-h-12 mts-text-black mts-text-center active:mts-scale-95"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CardDialog;
