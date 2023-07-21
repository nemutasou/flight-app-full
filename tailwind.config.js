/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                Rubik: ["Rubik", "sans-serif"],
            },
            keyframes: {
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                shimmer: "shimmer 1.5s infinite",
            },
            screens: {
                sm: "576px",
                // => @media (min-width: 576px) { ... }
                
                md: "960px",
                // => @media (min-width: 960px) { ... }
                
                lg: "1440px",
                // => @media (min-width: 1440px) { ... }
                xl: "1775px",
                fs: "1960px",
                tableShrink: "1280px",
                tableShrinkAgain: "990px",
            },
        },
    },
    plugins: [],
};
