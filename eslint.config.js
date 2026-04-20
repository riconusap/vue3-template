import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

const noScriptSetupRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow <script setup> in Vue single-file components',
    },
    schema: [],
    messages: {
      forbidden: 'Use setup() with defineComponent instead of <script setup>.',
    },
  },
  create(context) {
    const sourceText = context.sourceCode.getText()
    const hasScriptSetup = sourceText.includes('<script setup')

    return {
      Program(node) {
        if (hasScriptSetup) {
          context.report({ node, messageId: 'forbidden' })
        }
      },
    }
  },
}

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue,
      local: {
        rules: {
          'no-script-setup': noScriptSetupRule,
        },
      },
    },
    rules: {
      'local/no-script-setup': 'error',
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
]