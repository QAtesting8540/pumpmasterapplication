module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', '@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    es6: true
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',

    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'max-len': ['error', { code: 120 }],

    // Playwright specific rules
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/node_modules/**'],
            message: 'Do not import from node_modules directly'
          }
        ]
      }
    ]
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    },
    {
      files: ['playwright.config.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'test-results/',
    'playwright-report/',
    'allure-results/',
    'allure-report/',
    'coverage/',
    '*.js'
  ]
};
