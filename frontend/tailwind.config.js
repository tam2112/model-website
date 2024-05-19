/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                marcellus: '"Marcellus", serif',
            },
            colors: {
                primary: '#212123',
                secondary: '#8f8f8f',
                third: '#e8e8e8',
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    sm: '2rem',
                },
            },
        },
    },
    plugins: [],
};
