import { DEFAULT_PALETTE_CONFIG } from './constants';
import { nanoid } from 'nanoid';
import { createSwatches } from './createSwatches';
import Color from 'color';
export const setupColors = (color_raw: string, dark_color_base?: string) => {
    try {
        const color = Color(color_raw).hex();
        const pallet = createSwatches({
            ...DEFAULT_PALETTE_CONFIG,
            id: nanoid(),

            value: color.replace('#', '').toUpperCase(),
            swatches: [],
        }).map((item) => item.hex);

        // Remove the first and last item
        const modifiedPallet = pallet.slice(1, -1);

        const cssVariableKeys = [
            '--mts-primary-50',
            '--mts-primary-100',
            '--mts-primary-200',
            '--mts-primary-300',
            '--mts-primary-400',
            '--mts-primary-500',
            '--mts-primary-600',
            '--mts-primary-700',
            '--mts-primary-800',
            '--mts-primary-900',
            '--mts-primary-950',
        ];
        modifiedPallet.map((item, idx) => {
            document.documentElement.style.setProperty(
                cssVariableKeys[idx],
                Color(item).rgb().array().join(' ')
            );
        });
    } catch (error) {
        console.log(error);
    }

    try {
        if (!dark_color_base) return;
        const darkColor = Color(dark_color_base).hex();
        const darkPallet = createSwatches({
            ...DEFAULT_PALETTE_CONFIG,
            id: nanoid(),

            value: darkColor.replace('#', '').toUpperCase(),
            swatches: [],
        }).map((item) => item.hex);

        // Remove the first and last item
        const modifiedDarkPallet = darkPallet.slice(1, -1);
        const darkCssVariableKeys = [
            '--mts-dark-50',
            '--mts-dark-100',
            '--mts-dark-200',
            '--mts-dark-300',
            '--mts-dark-400',
            '--mts-dark-500',
            '--mts-dark-600',
            '--mts-dark-700',
            '--mts-dark-800',
            '--mts-dark-900',
            '--mts-dark-950',
        ];
        modifiedDarkPallet.map((item, idx) => {
            document.documentElement.style.setProperty(
                darkCssVariableKeys[idx],
                Color(item).rgb().array().join(' ')
            );
        });
    } catch (error) {
        console.log(error);
    }
};
