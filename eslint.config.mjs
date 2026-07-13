import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

const customConfig = defineConfig([
    {
        "languageOptions": {
            "globals": {
                "process": true,
            },
        },
    },
]);

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    customConfig,
);
