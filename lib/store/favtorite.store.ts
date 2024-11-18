import { create } from "zustand";

type SwapFavoriteStates = {
    favList: string[];
};

type SwapFavoriteActions = {
    addToFav: (fav: string) => void;
    isFav: (fav: string) => boolean;
    removeFromFav: (fav: string) => void;
};

export const useFavoriteStore = create<
    SwapFavoriteActions & SwapFavoriteStates
>((set, get) => ({
    favList: JSON.parse(localStorage.getItem("mts_widget_fav") ?? "[]"),
    isFav(fav) {
        const { favList } = get();
        return favList.includes(fav);
    },
    removeFromFav(fav) {
        const { favList } = get();
        const newFavList = favList.filter((f) => f !== fav);
        localStorage.setItem("mts_widget_fav", JSON.stringify(newFavList));
        set({ favList: newFavList });
    },
    addToFav: (fav) => {
        const { favList } = get();
        if (!favList.includes(fav)) {
            localStorage.setItem(
                "mts_widget_fav",
                JSON.stringify([...favList, fav])
            );
            set({ favList: [...favList, fav] });
        }
    },
}));
