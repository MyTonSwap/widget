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
import { IoClose } from 'react-icons/io5';
import { MdOutlineSearch } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import Token from './Token';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSwapStore } from '../../store/swap.store';
import { Asset } from '@mytonswap/sdk';
import sortAssets from '../../utils/sortAssets';
import { CgSpinnerTwo } from 'react-icons/cg';
import { address } from '@ton/ton';
import { TiWarning } from 'react-icons/ti';
import './CardDialog.scss';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { modalAnimationDesktop, modalAnimationMobile } from '../../constants';
import catchError from '../../utils/catchErrors';

import { reportErrorWithToast } from '../../services/errorAnalytics';
import { useTranslation } from 'react-i18next';
import FavList from './FavList';
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
                    item.address.includes(addressSearch)
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
                        className={clsx('card-dialog-container')}
                    >
                        <motion.div
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            className={clsx('card-dialog')}
                            ref={ref}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className="dialog-head">
                                <div>{t('select_a_token')}</div>
                                <button
                                    onClick={handleOnClose}
                                    className="card-dialog-close"
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div>
                                <div className="dialog-search">
                                    <MdOutlineSearch className="dialog-search-icon" />
                                    <input
                                        className="dialog-search-input"
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
                                <div className="pinned-token-container">
                                    {pinnedTokens.map((item) => {
                                        return (
                                            <button
                                                className="pinned-token"
                                                onClick={() => {
                                                    handleOnTokenSelect(item);
                                                }}
                                                key={item.address}
                                            >
                                                <div
                                                    className="pinned-token-image"
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
                                    <div className="tab-container">
                                        <button
                                            className={clsx(
                                                'tab-item',
                                                activeTab === TABS.ALL &&
                                                    'active'
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
                                                    className="tab-item-cursor"
                                                ></motion.div>
                                            )}
                                        </button>
                                        <button
                                            className={clsx(
                                                'tab-item',
                                                activeTab === TABS.FAVORITES &&
                                                    'active'
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
                                                    className="tab-item-cursor"
                                                ></motion.div>
                                            )}
                                        </button>
                                    </div>
                                    {activeTab === TABS.ALL && (
                                        <div
                                            className="dialog-tokens-container"
                                            style={{
                                                ...({
                                                    '--thumb-scrollbar': `var(--primary-color)`,
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
                                                    <div className="infinite-scroll-loading">
                                                        <CgSpinnerTwo className="animate-spin" />
                                                    </div>
                                                }
                                                endMessage={
                                                    filteredAssets.length ===
                                                    0 ? (
                                                        <div
                                                            className="no-token-found"
                                                            data-testid="token-not-found"
                                                        >
                                                            {t(
                                                                'token_notfound'
                                                            )}
                                                            <span>
                                                                {t(
                                                                    'not_found_desc'
                                                                )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="no-token-found"
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
                                <div className="dialog-community-modal">
                                    {contractCommunity && (
                                        <>
                                            <div className="community-modal-container">
                                                <div className="community-modal-warning">
                                                    <TiWarning className="icon" />
                                                    <h1 className="title">
                                                        {t(
                                                            'trade_warning.trade_title'
                                                        )}
                                                    </h1>
                                                    <p className="description">
                                                        {t(
                                                            'trade_warning.trade_description'
                                                        )}
                                                    </p>
                                                </div>
                                                {contractCommunity && (
                                                    <Token
                                                        asset={
                                                            contractCommunity
                                                        }
                                                        onTokenSelect={
                                                            onTokenSelect
                                                        }
                                                        type={type}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                className="accept-button"
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
                            <div className="close-footer">
                                <button
                                    onClick={handleOnClose}
                                    className="close-footer-button"
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
