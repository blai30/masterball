import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  // ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next/typescript',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }),
]

export default eslintConfig
