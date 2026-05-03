/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				white: '#f8f9fa',
			},
			fontFamily: {
				sans: ['Manrope', ...defaultTheme.fontFamily.sans],
				body: ['Manrope', ...defaultTheme.fontFamily.sans],
			},
			gridTemplateColumns: {
				list: 'repeat(auto-fill, minmax(400px, max-content))',
			},
			typography: (theme) => ({
				DEFAULT: {
					css: {
						'--tw-prose-body': theme('colors.zinc.700'),
						'--tw-prose-headings': theme('colors.zinc.900'),
						'--tw-prose-links': theme('colors.blue.700'),
						'--tw-prose-bold': theme('colors.zinc.900'),
						'--tw-prose-quotes': theme('colors.zinc.900'),
						'--tw-prose-quote-borders': theme('colors.zinc.300'),
						'--tw-prose-code': theme('colors.zinc.900'),
						'--tw-prose-pre-bg': theme('colors.zinc.900'),
						'--tw-prose-pre-code': theme('colors.zinc.100'),
						'--tw-prose-hr': theme('colors.zinc.200'),
						'--tw-prose-bullets': theme('colors.zinc.400'),
						'--tw-prose-counters': theme('colors.zinc.500'),
						'--tw-prose-captions': theme('colors.zinc.500'),
						'--tw-prose-th-borders': theme('colors.zinc.300'),
						'--tw-prose-td-borders': theme('colors.zinc.200'),
					},
				},
				invert: {
					css: {
						'--tw-prose-invert-body': theme('colors.zinc.300'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-links': theme('colors.blue.400'),
						'--tw-prose-invert-bold': theme('colors.white'),
						'--tw-prose-invert-quotes': theme('colors.zinc.100'),
						'--tw-prose-invert-quote-borders': theme('colors.zinc.700'),
						'--tw-prose-invert-code': theme('colors.white'),
						'--tw-prose-invert-pre-bg': theme('colors.zinc.900'),
						'--tw-prose-invert-pre-code': theme('colors.zinc.100'),
						'--tw-prose-invert-hr': theme('colors.zinc.700'),
						'--tw-prose-invert-bullets': theme('colors.zinc.600'),
						'--tw-prose-invert-counters': theme('colors.zinc.400'),
						'--tw-prose-invert-captions': theme('colors.zinc.400'),
						'--tw-prose-invert-th-borders': theme('colors.zinc.700'),
						'--tw-prose-invert-td-borders': theme('colors.zinc.800'),
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
};