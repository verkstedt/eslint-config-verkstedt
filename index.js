module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [ "react" ],
  env: {
    node: true,
    browser: true,
    es6: true
  },
  rules: {
    "func-call-spacing": [1, "never"],
    "indent": [1, 2, { "SwitchCase": 1 }],
    "no-cond-assign": 1,
    "no-console": 0,
    "no-constant-condition": 1,
    "no-control-regex": 1,
    "no-debugger": 1,
    "no-dupe-args": 1,
    "no-dupe-keys": 1,
    "no-duplicate-case": 1,
    "no-empty-character-class": 1,
    "no-empty": 1,
    "no-ex-assign": 1,
    "no-extra-boolean-cast": 1,
    "no-extra-parens": 0,
    "no-extra-semi": 1,
    "no-func-assign": 1,
    "no-inner-declarations": 1,
    "no-invalid-regexp": 1,
    "no-irregular-whitespace": 1,
    "no-negated-in-lhs": 1,
    "no-obj-calls": 1,
    "no-regex-spaces": 1,
    "no-sparse-arrays": 1,
    "no-unreachable": 1,
    "use-isnan": 1,
    "valid-jsdoc": 1,
    "valid-typeof": 1,
    "no-unexpected-multiline": 1,

    "accessor-pairs": 1,
    "block-scoped-var": 1,
    "complexity": 0,
    "consistent-return": 1,
    "curly": 1,
    "default-case": 1,
    "dot-notation": 1,
    "dot-location": [1, "property"],
    "eqeqeq": [1, "smart"],
    "guard-for-in": 1,
    "no-alert": 0,
    "no-caller": 1,
    "no-div-regex": 1,
    "no-else-return": 0,
    "no-eq-null": 1,
    "no-eval": 1,
    "no-extend-native": 1,
    "no-extra-bind": 1,
    "no-fallthrough": 1,
    "no-floating-decimal": 1,
    "no-implicit-coercion": 0,
    "no-implied-eval": 1,
    "no-invalid-this": 0,
    "no-iterator": 1,
    "no-labels": 1,
    "no-lone-blocks": 1,
    "no-loop-func": 1,
    "no-multi-spaces": [1, { exceptions: { "ImportDeclaration": true }}],
    "no-multi-str": 1,
    "no-native-reassign": 1,
    "no-new-func": 1,
    "no-new-wrappers": 1,
    "no-new": 1,
    "no-octal-escape": 1,
    "no-octal": 1,
    "no-param-reassign": 0,
    "no-process-env": 0,
    "no-proto": 1,
    "no-redeclare": 1,
    "no-return-assign": 1,
    "no-script-url": 1,
    "no-self-compare": 1,
    "no-sequences": 1,
    "no-throw-literal": 1,
    "no-unused-expressions": 1,
    "no-useless-call": 1,
    "no-useless-concat": 1,
    "no-void": 1,
    "no-warning-comments": 0,
    "no-with": 1,
    "radix": 0,
    "vars-on-top": 1,
    "wrap-iife": 1,
    "yoda": [1, "never"],

    "init-declarations": 0,
    "no-catch-shadow": 1,
    "no-delete-var": 1,
    "no-label-var": 1,
    "no-shadow-restricted-names": 1,
    "no-shadow": 1,
    "no-undef-init": 0,
    "no-undef": 2,
    "no-undefined": 1,
    "no-unused-vars": 1,
    "no-use-before-define": 1,

    "callback-return": 1,
    "handle-callback-err": 1,
    "no-mixed-requires": 1,
    "no-new-require": 1,
    "no-path-concat": 1,
    "no-process-exit": 1,
    "no-restricted-modules": 0,
    "no-sync": 1,


    "arrow-parens": 0,
    "arrow-spacing": 1,
    "constructor-super": 1,
    "generator-star-spacing": [1, {"before": false, "after": true}],
    "no-class-assign": 1,
    "no-const-assign": 1,
    "no-dupe-class-members": 1,
    "no-this-before-super": 1,
    "no-var": 1,
    "object-shorthand": 1,
    "object-curly-spacing": [1, "always"],
    "prefer-arrow-callback": 1,
    "prefer-const": 1,
    "prefer-spread": 1,
    "prefer-reflect": 1,
    "prefer-template": 1,
    "require-yield": 1,
    "space-infix-ops": 1,
    "space-in-parens": [1, "never"],
    "space-before-blocks": 1,
    "func-style": [1, "declaration", { "allowArrowFunctions": true }],
    

    "new-parens": 1,
    "no-underscore-dangle": 0,
    "comma-dangle": 0,
    "quotes": [ 1, "single" ],
    "semi": [1, "never"],
    "new-cap": 1,
    "no-mixed-spaces-and-tabs": [1, "smart-tabs"],
    "keyword-spacing": 1,
    "eol-last": 1,
    "react/jsx-boolean-value": 1,
    "jsx-quotes": [1, "prefer-double"],
    "react/jsx-no-undef": 2,
    "react/jsx-uses-react": 1,
    "react/jsx-uses-vars": 1,
    "react/no-did-mount-set-state": 1,
    "react/no-did-update-set-state": 1,
    "react/no-multi-comp": [1, { "ignoreStateless": true }],
    "react/no-unknown-property": 1,
    "react/react-in-jsx-scope": 1,
    "react/self-closing-comp": 1,

    "arrow-parens": [1, "as-needed"],
    "max-len": [1, 80, 2]
  }
}
