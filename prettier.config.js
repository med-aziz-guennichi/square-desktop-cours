/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    printWidth: 100,
    singleQuote: true,
    trailingComma: "all",
    plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
    overrides: [
        {
            files: ["src/**/*.{js,ts,tsx}"],
            options: {
                // otherwise code blocks overflow on the docs website
                // The container is 751px
                printWidth: 85,
            },
        },
        {
            files: ["**/*.json"],
            options: {
                trailingComma: "none",
            },
        },
    ],
};

export default config;