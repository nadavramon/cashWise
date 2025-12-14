// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ["expo", "prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": "error",
    },
    ignorePatterns: ["node_modules/", "dist/", "build/", ".expo/", "coverage/"],
};
