module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": 0,
        "no-constant-condition": 0,
        "no-console": 0,
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": 1,
        "no-unused-vars": 1,
        "semi": [
            "error",
            "always"
        ]
    }
};
