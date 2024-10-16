/** @type {import('tailwindcss').Config} */
export default {
    content: [
        // refrence the library only
        "./lib/**/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            gridTemplateColumns: {
                swapcard: "1fr auto",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
