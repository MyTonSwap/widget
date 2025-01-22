import clsx from 'clsx';
import { FC, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import SwapKeyValue from './SwapKeyValue';
import { AnimatePresence, motion } from 'framer-motion';
import { useSwapStore } from '../../store/swap.store';
import formatNumber from '../../utils/formatNum';
import { CgSpinnerTwo } from 'react-icons/cg';
import { useTranslation } from 'react-i18next';
import { useMeasure } from '@uidotdev/usehooks';
import { BsArrowRightShort, BsChevronRight } from 'react-icons/bs';

const SwapDetails = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { onePayRoute, bestRoute, isFindingBestRoute, slippage } =
        useSwapStore();
    const [ref, { height }] = useMeasure();
    return (
        <motion.button
            className="mts-flex mts-flex-col mts-items-center mts-mt-3 mts-rounded-lg   mts-w-full mts-min-h-12 mts-text-black dark:mts-text-white"
            onClick={() => {
                setIsOpen((prev) => !prev);
            }}
            data-testid="swap-details"
        >
            <div className="mts-flex mts-justify-between mts-items-center mts-w-full mts-min-h-12 mts-font-medium mts-text-sm">
                {onePayRoute && onePayRoute.pool_data && !isFindingBestRoute ? (
                    <div className="one-pay mts-ltr">
                        1 {onePayRoute.pool_data.route_view[0]} ≈{' '}
                        {formatNumber(onePayRoute.pool_data.receive_show, 4)}{' '}
                        {
                            onePayRoute.pool_data.route_view[
                                onePayRoute.pool_data.route_view.length - 1
                            ]
                        }
                    </div>
                ) : (
                    <div className="mts-flex mts-gap-1 mts-items-center">
                        <CgSpinnerTwo className="mts-animate-spin mts-text-primary-500" />
                        {t('fetching_best_route')}
                    </div>
                )}
                <div>
                    <MdKeyboardArrowDown
                        className={clsx(
                            'mts-transition-all mts-duration-200 mts-ease-in-out mts-text-lg',
                            isOpen ? 'mts-rotate-180' : ''
                        )}
                    />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            transition: { delay: 0.05 },
                            height: height ?? 0,
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mts-flex mts-flex-col mts-gap-1 mts-w-full mts-overflow-hidden mts-bg-zinc-100 dark:mts-bg-zinc-900 dark:mts-border-zinc-800 mts-rounded-lg mts-border-zinc-200 mts-border-[1px]"
                    >
                        <div
                            ref={ref}
                            className="mts-flex mts-flex-col mts-gap-1 mts-p-4 "
                        >
                            <SwapKeyValue
                                keyText={t('slippage_tolerance')}
                                value={
                                    <div className="mts-rounded-full mts-bg-zinc-200 dark:mts-bg-zinc-700 dark:mts-text-white mts-px-2 mts-py-1 mts-text-black">
                                        {slippage === 'auto' ? '1' : slippage}%{' '}
                                        {slippage === 'auto' ? t('auto') : ''}
                                    </div>
                                }
                            />
                            <SwapKeyValue
                                keyText={t('blockchain_fee')}
                                value={
                                    bestRoute?.pool_data.blockchainFee ??
                                    '0 TON'
                                }
                            />
                            <SwapKeyValue
                                keyText={t('price_impact')}
                                value={
                                    <span data-testid="price-impact">
                                        {bestRoute
                                            ? bestRoute.pool_data.priceImpact +
                                              '%'
                                            : '0%'}
                                    </span>
                                }
                            />
                            <SwapKeyValue
                                keyText={t('minimum_received')}
                                value={
                                    bestRoute?.pool_data.minimumReceive_show ??
                                    '0'
                                }
                            />
                            <SwapKeyValue
                                keyText={t('route')}
                                value={
                                    bestRoute ? (
                                        <div className="mts-flex mts-justify-center mts-gap-0.5">
                                            <span
                                                className="mts-flex mts-justify-center mts-items-center mts-gap-1"
                                                data-testid="dex-container"
                                            >
                                                <div
                                                    className="!mts-bg-contain mts-w-3 mts-h-3"
                                                    style={{
                                                        background: `url(${
                                                            bestRoute
                                                                .selected_pool
                                                                .dex_details
                                                                .icon_url
                                                        })`,
                                                    }}
                                                ></div>
                                                {
                                                    bestRoute.selected_pool
                                                        .dex_details.name
                                                }
                                                <BsArrowRightShort />
                                            </span>
                                            <RouteView
                                                routes={
                                                    bestRoute.pool_data
                                                        .route_view
                                                }
                                            />
                                        </div>
                                    ) : (
                                        'Enter amount'
                                    )
                                }
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
};

const RouteView: FC<{ routes: string[] }> = ({ routes }) => {
    return (
        <span className="mts-flex mts-items-center mts-gap-0.5">
            {routes.map((route, idx) => (
                <>
                    {route}{' '}
                    {idx !== routes.length - 1 && (
                        <BsChevronRight className="mts-text-xs" />
                    )}
                </>
            ))}
        </span>
    );
};

export default SwapDetails;
