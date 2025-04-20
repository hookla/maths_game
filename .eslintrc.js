module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'import'
  ],
  rules: {
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'no-redeclare': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-extra-semi': 'error'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  }
};