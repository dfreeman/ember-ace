'use strict';

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ['ember', 'prettier'],
  extends: [
    '@dfreeman/eslint-config',
    'eslint:recommended',
    'plugin:ember/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './config/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['@dfreeman', 'plugin:qunit/recommended'],
    },
  ],
};
