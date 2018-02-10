const path = require('path');

module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended",
    "plugin:no-russian-chars/all"
  ],
  "plugins": [
    "flowtype"
  ],
  "globals": {
    "__DEV__": true
  },
  "env": {
    "browser": true
  },
  "rules": {
    "arrow-body-style": "off",
    "function-paren-newline": "off",
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/img-has-alt": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "no-console": "off",
    "no-restricted-globals": "off",
    "object-curly-newline": "off",
    "prefer-destructuring": "off",
    "react/default-props-match-prop-types": "error",
    "react/jsx-closing-tag-location": "off",
    "react/jsx-curly-brace-presence": "off",
    "react/jsx-filename-extension": "off",
    "react/no-unused-state": "error",
    "react/prefer-stateless-function": "off",
  }
}
