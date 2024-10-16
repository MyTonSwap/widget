import clsx from "clsx";
import {
    CSSProperties,
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
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

    const onNextPage = async (currPage: number) => {
        if (type === "pay") {
            const newAssets = await client.assets.getPaginatedAssets(
                currPage,
                communityTokens,
                searchInput
            );
            setPage(currPage + 1);
            addToAssets(newAssets.assets);
            setHasMore(!newAssets.meta.isLastPage);
            return;
        }
        if (type === "receive" && !pay_token) return;
        if (type === "receive") {
            const newAssets = await client.assets.getPairs(
                pay_token!.address,
                currPage,
                communityTokens,
                searchInput
            );

            setPage(currPage + 1);
            setReceiveAssets((prev) => {
                const mergedAssets = [...prev, ...newAssets.assets];

                // Filter to keep unique assets based on the 'address' property
                const uniqueAssets = mergedAssets.filter(
                    (asset, index, self) =>
                        index ===
                        self.findIndex((a) => a.address === asset.address)
                );

                return uniqueAssets;
            });
            if (newAssets.assets.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(!newAssets.meta.isLastPage);
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

    const { colors } = useThemeStore();
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
                const assetByAddr = await client.assets.getExactAsset(addr);
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
        } catch (err) {
            console.log(err);
            if (promptForCommunity) setPromptForCommunity(false);
        }
    }, [searchInput]);

    return (
        <>
            <AnimatePresence>
                {isSelectVisible && (
                    <motion.div
                        initial={{ top: "15%", opacity: 0 }}
                        animate={{ top: "0%", opacity: 1 }}
                        exit={{ top: "15%", opacity: 0 }}
                        className={clsx(
                            "w-full h-full absolute top-0 left-0 z-10 overflow-hidden"
                        )}
                    >
                        <div
                            className={clsx(
                                "absolute top-0 left-0 w-full h-full transition-all p-4 flex flex-col"
                            )}
                            style={{ background: colors.background }}
                        >
                            <div
                                className="flex items-center justify-between"
                                style={{ color: colors.text_black }}
                            >
                                <div>Select token</div>
                                <button
                                    onClick={handleOnClose}
                                    className="text-xl"
                                >
                                    <IoClose />
                                </button>
                            </div>
                            <div>
                                <div
                                    className="h-10 mt-2 rounded-xl w-full border-[1px] border-zinc-200 flex items-center px-2"
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
                                        className="w-full h-full bg-transparent px-1 outline-none text-sm"
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
                                        className="flex-grow overflow-y-scroll"
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
                                                <div className="flex items-center justify-center h-10 text-xl">
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
                                <div className="flex flex-col h-full">
                                    {contractCommunity && (
                                        <>
                                            <div className="flex-grow">
                                                <div
                                                    className="flex flex-col justify-center items-center p-2 my-1 rounded-xl"
                                                    style={{
                                                        color: colors.text_black,
                                                        background:
                                                            colors.input_card,
                                                    }}
                                                >
                                                    <TiWarning className="text-3xl text-yellow-500" />
                                                    <h1 className="text-base font-bold">
                                                        Trade at your own risk
                                                    </h1>
                                                    <p className="text-sm text-center px-5">
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
                                                className="flex h-10 rounded-xl w-full items-center justify-center text-sm"
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CardDialog;
