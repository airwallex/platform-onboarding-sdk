module.exports = {
  extends: ['@airwallex/javascript', 'plugin:import/typescript'],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-shadow': 'warn',
    'no-prototype-builtins': 'warn',
    'import/named': 'off',
    'import/namespace': ['warn', { allowComputed: true }],
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
