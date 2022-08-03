'use strict';

module.exports = {
  root: true,
  extends: '@dfreeman',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
};
