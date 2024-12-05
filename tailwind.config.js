import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'spacegrotesk' : ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                'primary': '#7F2BFF',
                'secondary': '#203496',
                'custom-green': '#09F205',
                'custom-yellow': '#FFBE00',
            }
        },
    },

    plugins: [forms],
};
