// @ts-expect-error this is also fine
export const WIDGET_VERSION = import.meta.env.PACKAGE_VERSION as string;
export const TON_FEE_MINIMUM = 0.25;
export const TON_ADDR = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

export const modalAnimationMobile = {
    initial: {
        opacity: 0,
        bottom: "0%",
        left: "0%",
        transform: "translateY(60%) translateX(0)",
        transition: { duration: 0.5, ease: [0.4, 0.4, 0, 1] },
    },
    animate: {
        bottom: "0%",
        left: "0%",
        opacity: 1,
        transform: "translateY(0) translateX(0)",
        transition: { duration: 0.5, ease: [0.4, 0.4, 0, 1] },
    },
    exit: {
        bottom: "0%",
        left: "0%",
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

export const popOverVariations = {
    bottomRight: {
        initial: {
            opacity: 0,
            scale: 0.95,
            transformOrigin: "top right",
            top: "115%",
            right: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            top: "115%",
            right: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },
    bottomLeft: {
        initial: {
            opacity: 0,
            scale: 0.95,
            transformOrigin: "top left",
            top: "115%",
            left: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            top: "115%",
            left: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },
    topRight: {
        initial: {
            opacity: 0,
            scale: 0.95,
            transformOrigin: "top right",
            bottom: "115%",
            top: "auto",
            right: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            bottom: "115%",
            top: "auto",
            right: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            top: "auto",
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },
    topLeft: {
        initial: {
            opacity: 0,
            scale: 0.95,
            transformOrigin: "bottom left",
            bottom: "115%",
            top: "auto",
            left: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            bottom: "115%",
            top: "auto",
            left: "0%",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            top: "auto",
            scale: 0.95,
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },

    topCenter: {
        initial: {
            opacity: 0,
            scale: 0.5,
            transformOrigin: "bottom center",
            bottom: "115%",
            top: "auto",
            left: "50%",
            transform: "translateX(-50%) scale(0.95)",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            bottom: "115%",
            top: "auto",
            left: "50%",
            transform: "translateX(-50%) scale(1)",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            bottom: "110%",
            top: "auto",
            left: "50%",
            scale: 0.5,
            transform: "translateX(-50%) scale(0.95)",
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },
    bottomCenter: {
        initial: {
            opacity: 0,
            scale: 0.8,
            transformOrigin: "top center",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        animate: {
            opacity: 1,
            scale: 1,
            transformOrigin: "bottom center",
            top: "115%",
            left: "50%",
            transform: "translateX(-50%)",
            transition: { duration: 0.15, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            top: "110%",
            transformOrigin: "bottom center",
            scale: 0.8,
            transition: { duration: 0.15, ease: "easeOut" },
        },
    },
};

export const popOverVariationsKeyValue = {
    "top-right": popOverVariations.topRight,
    "top-left": popOverVariations.topLeft,
    "bottom-right": popOverVariations.bottomRight,
    "bottom-left": popOverVariations.bottomLeft,
    "top-center": popOverVariations.topCenter,
    "bottom-center": popOverVariations.bottomCenter,
};
