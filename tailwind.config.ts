
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				lime: {
					DEFAULT: '#84cc16',
					50: '#f7fee7',
					100: '#ecfccb',
					200: '#d9f99d',
					300: '#bef264',
					400: '#a3e635',
					500: '#84cc16',
					600: '#65a30d',
					700: '#4d7c0f',
					800: '#3f6212',
					900: '#365314',
					950: '#1a2e05',
				},
				forest: {
					DEFAULT: '#1a2e05',
					50: '#f4f7ee',
					100: '#e6ecd9',
					200: '#cfdbb8',
					300: '#b0c48e',
					400: '#92ad66',
					500: '#7a9748',
					600: '#5e7735',
					700: '#4a5d2c',
					800: '#3f4e26',
					900: '#374424',
					950: '#1a2e05',
				},
				green: {
					DEFAULT: '#006142',
					50: '#eef8f4',
					100: '#d7f0e6',
					200: '#afe0cd',
					300: '#7dccaf',
					400: '#45b18a',
					500: '#006142',
					600: '#00583c',
					700: '#004d35',
					800: '#003d2b',
					900: '#002f22',
					950: '#001d15',
				},

				yellow: {
					DEFAULT: '#f9d624',
					50: '#fffdf2',
					100: '#fef8d7',
					200: '#fdefa4',
					300: '#fbe56b',
					400: '#f9dc3f',
					500: '#f9d624',
					600: '#d9b400',
					700: '#b08f00',
					800: '#866d00',
					900: '#5c4b00',
					950: '#352b00',
				},

				teal: {
					DEFAULT: '#00a3b1',
					50: '#ecfcfd',
					100: '#d2f5f7',
					200: '#a7eaf0',
					300: '#68d0d9',
					400: '#32bbc7',
					500: '#00a3b1',
					600: '#008491',
					700: '#006a74',
					800: '#00545c',
					900: '#003b40',
					950: '#00272b',
				},

				orange: {
					DEFAULT: '#f56a14',
					50: '#fff7ed',
					100: '#ffeadb',
					200: '#fdd3b5',
					300: '#faa873',
					400: '#f78945',
					500: '#f56a14',
					600: '#d9530f',
					700: '#b8470e',
					800: '#8e370e',
					900: '#65270a',
					950: '#3d1605',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateX(-20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in': 'slide-in 0.3s ease-out'
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				heading: ['Montserrat', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
