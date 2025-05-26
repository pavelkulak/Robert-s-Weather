import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';

export default [
    {
        ...js.configs.recommended,
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                window: 'readonly',
                alert: 'readonly',
                location: 'readonly',
                MutationObserver: 'readonly',
                Intl: 'readonly',
                L: 'readonly', // Leaflet карта
            },
        },
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: 'vue-eslint-parser',
            parserOptions: {
                parser: 'espree',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            vue,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
    prettier,
];
