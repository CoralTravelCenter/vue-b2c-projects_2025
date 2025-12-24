// stylelint.config.cjs
module.exports = {
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-rational-order",
  ],
  rules: {
    "max-nesting-depth": 3,
    "selector-max-specificity": "0,3,0",
    "declaration-no-important": true,
  },
  overrides: [
    {
      files: ["**/*.vue"],
      extends: ["stylelint-config-recommended-vue"],
    },
  ],
};
