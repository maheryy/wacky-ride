const ERROR = 2;

module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort"],
  root: true,
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ERROR,
    "@typescript-eslint/no-explicit-any": ERROR,

    // Require or disallow padding lines between statements
    // Enforce position of line comments
    "line-comment-position": [ERROR, { position: "above" }],

    // Require empty lines around comments
    "lines-around-comment": [
      ERROR,
      {
        beforeBlockComment: true,
        afterBlockComment: false,
        beforeLineComment: true,
        afterLineComment: false,
        allowBlockStart: true,
        allowBlockEnd: false,
        allowObjectStart: true,
        allowObjectEnd: false,
        allowArrayStart: true,
        allowArrayEnd: false,
      },
    ],

    "padding-line-between-statements": [
      ERROR,

      // Require an empty line before return statements
      { blankLine: "always", prev: "*", next: "return" },

      // Require an empty line after variable declarations, but no between them
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },

      // Require an empty line before block statements
      { blankLine: "always", prev: "*", next: "block-like" },

      // Require an empty line after if statements
      { blankLine: "always", prev: "if", next: "*" },

      // Require an empty line before directives
      { blankLine: "always", prev: "directive", next: "*" },

      // Require an empty line after import statements
      { blankLine: "always", prev: "import", next: "*" },

      // Disallow an empty line between import statements
      { blankLine: "never", prev: "import", next: "import" },

      // Require an empty line after commonjs require statements
      { blankLine: "always", prev: "cjs-import", next: "*" },

      // Disallow an empty line between commonjs require statements
      { blankLine: "never", prev: "cjs-import", next: "cjs-import" },

      // Require an empty line before commonjs exports statements
      { blankLine: "always", prev: "*", next: "cjs-export" },
    ],
    "prettier/prettier": [
      ERROR,
      {
        endOfLine: "auto",
      },
    ],
    "simple-import-sort/imports": [
      ERROR,
      {
        groups: [
          [
            // Side effect imports.
            "^\\u0000",

            // Packages.
            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            "^@?\\w",

            // Absolute imports and other imports.
            // Anything not matched in another group.
            "^",

            // Relative imports.
            // Anything that starts with a dot.
            "^\\.",
          ],
        ],
      },
    ],
    "simple-import-sort/exports": ERROR,
  },
};
