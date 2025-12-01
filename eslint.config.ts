import type { ConfigWithExtends } from 'typescript-eslint';
import { configs } from 'typescript-eslint';
import type { RuleOptions } from '@stylistic/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

type RulesRecord<Rules extends object> = {
  readonly [Key in keyof Rules]?: Rules[Key] extends unknown[] ? Linter.RuleEntry<Rules[Key]> : never
};

// Customized Stylistic Rules
const styleRules: RulesRecord<RuleOptions> = {
  '@stylistic/array-bracket-newline': ['error'],
  '@stylistic/array-element-newline': ['error', { consistent: true, multiline: true }],
};

// Customized Stylistic Config
const styleConfigs: Linter.Config[] = [
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    braceStyle: '1tbs',
    arrowParens: true,
  }),
  { rules: styleRules },
];

// Picked rules for TypeScript
const tsRules: Linter.RulesRecord = {
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/no-unnecessary-type-parameters': 'off',
  '@typescript-eslint/restrict-plus-operands': 'error',
  '@typescript-eslint/strict-boolean-expressions': 'error',
};

// Picked rules for JavaScript/TypeScript
const esRules: Linter.RulesRecord = {
  'eqeqeq': 'error',
  'import/default': 'off',
  'import/no-cycle': 'error',
  'import/no-duplicates': 'error',
  'import/no-named-as-default': 'off',
  'import/no-unresolved': 'error',
  'import/order': 'error',
  'linebreak-style': ['error', 'unix'],
  'no-implicit-coercion': 'error',
};

const esConfig: Linter.Config = { rules: esRules };

// Config for files that need type checking
const typeCheckingConfig = {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  files: ['**/*.ts'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: tsRules,
} satisfies ConfigWithExtends;

// Ignore files and directories that do not need linting
const ignoreConfig: Linter.Config<never> = {
  ignores: [
    '.github',
    'coverage',
    'dist',
    'docker',
    'envs',
    'node_modules',
    'prisma',
    'tasks',
    'stacks',
  ],
};

const pluginsConfig: Linter.Config = { plugins: { '@stylistic': stylistic } };

export default defineConfig(
  pluginsConfig,
  styleConfigs,
  eslint.configs.recommended,
  configs.strictTypeChecked,
  configs.stylisticTypeChecked,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  typeCheckingConfig,
  esConfig,
  ignoreConfig,
);
