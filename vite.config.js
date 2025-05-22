import { defineConfig } from "vite";
import ViteSvgSpriteWrapper from 'vite-svg-sprite-wrapper';

export default defineConfig({
    base: "/Robert-s-Weather/", // Замени на название твоего репозитория
    define: {
        'import.meta.env.VITE_API_KEY': JSON.stringify('4e88cbe360a5181d59fb73d2bee0c230'),
        'import.meta.env.VITE_UNSPLASH_KEY': JSON.stringify('Ie-v99zRFc6xkpCVhSXQKKRdwzheohCdmwvcxcDScYw')
    },
    plugins: [
		ViteSvgSpriteWrapper({
			icons: './src/icon/*.svg',
			outputDir: './public/'
        })
	]
});