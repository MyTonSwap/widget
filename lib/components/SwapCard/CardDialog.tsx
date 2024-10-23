import clsx from "clsx";
import {
    CSSProperties,
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { IoClose } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Token from "./Token";
import { useThemeStore } from "../../store/theme.store";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSwapStore } from "../../store/swap.store";
import { Asset } from "@mytonswap/sdk";
import sortAssets from "../../utils/sortAssets";
import { CgSpinnerTwo } from "react-icons/cg";
import { address } from "@ton/ton";
import { TiWarning } from "react-icons/ti";
import "./CardDialog.scss";
import { useMediaQuery, useOnClickOutside } from "usehooks-ts";
import { modalAnimationDesktop, modalAnimationMobile } from "../../constants";
import catchError from "../../utils/catchErrors";
type CardDialogProps = {
    isSelectVisible: boolean;
    setIsSelectVisible: Dispatch<SetStateAction<boolean>>;
    type: "pay" | "receive";
    onTokenSelect: (asset: Asset) => void;
};

// enum TABS {
//     ALL = "ALL",
//     FAVORITES = "FAVORITES",
// }

const CardDialog: FC<CardDialogProps> = ({
    isSelectVisible,
    setIsSelectVisible,
    onTokenSelect,
    type,
}) => {
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
    // const [activeTab, setActiveTab] = useState<TABS>(TABS.ALL);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [contractCommunity, setContractCommunity] = useState<Asset | null>(
        null
    );
    const [promptForCommunity, setPromptForCommunity] = useState(false);
    const { colors } = useThemeStore();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const ref = useRef(null);
    const onNextPage = async (currPage: number) => {
        if (type === "pay") {
            const result = await catchError(() =>
                client.assets.getPaginatedAssets(
                    currPage,
                    communityTokens,
                    searchInput
                )
            );
            if (result.error) return console.log("make this alert!");
            const { assets, meta } = result.data;
            setPage(currPage + 1);
            addToAssets(assets);
            setHasMore(!meta.isLastPage);
            return;
        }
        if (type === "receive" && !pay_token) return;
        if (type === "receive") {
            const newAssets = await catchError(() =>
                client.assets.getPairs(
                    pay_token!.address,
                    currPage,
                    communityTokens,
                    searchInput
                )
            );
            if (newAssets.error) return console.log("make this alert!");
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
        onNextPage(page);
    }, []);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setReceiveAssets([]);
        onNextPage(1);
    }, [pay_token]);
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setReceiveAssets([]);
        onNextPage(1);
    }, [searchInput]);

    const assetList = type === "pay" ? assets : receiveAssets;

    const handleOnTokenSelect = (asset: Asset) => {
        setSearchInput("");
        onTokenSelect(asset);
        setPage(1);
        setHasMore(true);
        setReceiveAssets([]);
        onNextPage(1);
    };

    const filteredAssets = assetList
        ? assetList.sort(sortAssets).filter((item) => {
              if (
                  searchInput.toLowerCase() === "usdt" &&
                  item.symbol === "USD₮"
              ) {
                  return true;
              }
              const searchValue = searchInput.toLowerCase();

              return (
                  item.name.toLowerCase().includes(searchValue) ||
                  item.symbol.toLowerCase().includes(searchValue) ||
                  item.address.includes(searchInput)
              );
          })
        : [];

    const handleOnClose = () => {
        setIsSelectVisible(false);
        setSearchInput("");
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
                if (assetByAddrResult.error)
                    return console.log("make this alert!");

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
                        className={clsx("card-dialog-container")}
                    >
                        <motion.div
                            initial={modalAnimation.initial}
                            animate={modalAnimation.animate}
                            exit={modalAnimation.exit}
                            className={clsx("card-dialog")}
                            ref={ref}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            style={{ background: colors.background }}
                        >
                            <div
                                className="dialog-head"
                                style={{ color: colors.text_black }}
                            >
                                <div>Select token</div>
                                <button
                                    onClick={handleOnClose}
                                    className="text-xl"
                                >
                                    <IoClose
                                        style={{
                                            color: colors.text_black,
                                            opacity: 0.5,
                                        }}
                                    />
                                </button>
                            </div>
                            <div>
                                <div
                                    className="dialog-search"
                                    style={{ borderColor: colors.border }}
                                >
                                    <MdOutlineSearch
                                        className="text-black/50"
                                        style={{
                                            color: colors.text_black,
                                            opacity: 0.5,
                                        }}
                                    />
                                    <input
                                        className="dialog-search-input"
                                        type="text"
                                        placeholder="Search..."
                                        style={{
                                            color: colors.text_black,
                                        }}
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
                                                style={{
                                                    color: colors.text_black,
                                                    background:
                                                        colors.light_shade,
                                                }}
                                                onClick={() => {
                                                    handleOnTokenSelect(item);
                                                }}
                                                key={item.address}
                                            >
                                                <div
                                                    className="pinned-token-image"
                                                    style={{
                                                        background: `url(${item.image}) ${colors.background}`,
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
                                    {/* <div
                                        className="flex items-center gap-5 text-sm font-light px-3 mt-3 w-full border-b-[1px] pb-2"
                                        style={{ borderColor: colors.border }}
                                    >
                                        <button
                                            className={clsx(
                                                "relative",
                                                activeTab === TABS.ALL &&
                                                    " font-bold"
                                            )}
                                            style={{
                                                color:
                                                    activeTab === TABS.ALL
                                                        ? colors.primary
                                                        : colors.layout
                                                              ?.text_black,
                                            }}
                                            onClick={() =>
                                                setActiveTab(TABS.ALL)
                                            }
                                        >
                                            All
                                            {activeTab === TABS.ALL && (
                                                <motion.div
                                                    layoutId="tab-underline"
                                                    className="w-full h-[1px] absolute -bottom-[9px] "
                                                    style={{
                                                        background:
                                                            colors.primary,
                                                    }}
                                                ></motion.div>
                                            )}
                                        </button>
                                        <button
                                            className={clsx(
                                                "relative",
                                                activeTab === TABS.FAVORITES &&
                                                    "font-bold"
                                            )}
                                            style={{
                                                color:
                                                    activeTab === TABS.FAVORITES
                                                        ? colors.primary
                                                        : colors.layout
                                                              ?.text_black,
                                            }}
                                            onClick={() =>
                                                setActiveTab(TABS.FAVORITES)
                                            }
                                        >
                                            Favorites
                                            {activeTab === TABS.FAVORITES && (
                                                <motion.div
                                                    layoutId="tab-underline"
                                                    className="w-full h-[1px]  absolute -bottom-[9px] "
                                                    style={{
                                                        background:
                                                            colors.primary,
                                                    }}
                                                ></motion.div>
                                            )}
                                        </button>
                                    </div> */}
                                    <div
                                        className="dialog-tokens-container"
                                        style={{
                                            ...({
                                                "--thumb-scrollbar":
                                                    colors.primary,
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
                                                    <CgSpinnerTwo
                                                        className="animate-spin"
                                                        style={{
                                                            color: colors.primary,
                                                        }}
                                                    />
                                                </div>
                                            }
                                        >
                                            {filteredAssets?.map((item) => (
                                                <Token
                                                    onTokenSelect={
                                                        handleOnTokenSelect
                                                    }
                                                    asset={item}
                                                    key={item.address}
                                                />
                                            ))}
                                        </InfiniteScroll>
                                    </div>
                                </>
                            )}
                            {promptForCommunity && (
                                <div className="dialog-community-modal">
                                    {contractCommunity && (
                                        <>
                                            <div className="community-modal-container">
                                                <div
                                                    className="community-modal-warning"
                                                    style={{
                                                        color: colors.text_black,
                                                        background:
                                                            colors.input_card,
                                                    }}
                                                >
                                                    <TiWarning className="icon" />
                                                    <h1 className="title">
                                                        Trade at your own risk
                                                    </h1>
                                                    <p className="description">
                                                        Anyone can create an
                                                        asset including fake
                                                        versions of existing
                                                        assets that claim a
                                                        project representation
                                                    </p>
                                                </div>
                                                {contractCommunity && (
                                                    <Token
                                                        asset={
                                                            contractCommunity
                                                        }
                                                        onTokenSelect={() => {}}
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
                                                    onTokenSelect(
                                                        contractCommunity!
                                                    );
                                                }}
                                                style={{
                                                    background: colors.primary,
                                                    color: colors.text_black,
                                                }}
                                            >
                                                Agree and proceed
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CardDialog;
