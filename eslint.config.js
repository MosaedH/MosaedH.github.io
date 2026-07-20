// ESLint 9 flat config with the Astro plugin (NEW_PLAN §8).
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/'] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // The RTL rule (NEW_PLAN §2) is enforced by scripts/verify-logical-props.mjs;
      // nothing here should weaken TypeScript or Astro recommended sets.
    },
  },
];
