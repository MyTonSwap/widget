// @ts-expect-error this is also fine
export const WIDGET_VERSION = import.meta.env.PACKAGE_VERSION as string;
export const TON_FEE_MINIMUM = 0.25;
export const TON_ADDR = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

export const modalAnimationMobile = {
    initial: {
        opacity: 0,
        transform: "translateY(60%) translateX(0)",
        transition: { duration: 0.5, ease: [0.4, 0.4, 0, 1] },
    },
    animate: {
        opacity: 1,
        transform: "translateY(0) translateX(0)",
        transition: { duration: 0.5, ease: [0.4, 0.4, 0, 1] },
    },
    exit: {
        opacity: 0,
        transform: "translateY(60%) translateX(0)",
        transition: { duration: 0.5, ease: [0.4, 0.4, 0, 1] },
    },
};

export const modalAnimationDesktop = {
    initial: {
        opacity: 0,
        bottom: "50%",
        left: "50%",
        transform: "translate(-50%, 50%) scale(1.03)",
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
    animate: {
        opacity: 1,
        bottom: "50%",
        left: "50%",
        transform: "translate(-50%, 50%) scale(1)",
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
        opacity: 0,
        bottom: "50%",
        left: "50%",
        transform: "translate(-50%, 50%) scale(1.03)",
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
};
