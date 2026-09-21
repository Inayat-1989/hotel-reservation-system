import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build']),

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: { 
        ecmaFeatures: { jsx: true } 
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      
      ...reactHooks.configs.recommended.rules,
      
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  prettierConfig
])
