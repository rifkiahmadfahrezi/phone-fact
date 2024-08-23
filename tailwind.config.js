/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui:{
    themes: [
      {
        'corporate': {
           'primary' : '#4768fa',
           'primary-focus' : '#153ff9',
           'primary-content' : '#ffffff',

           'secondary' : '#7b92b2',
           'secondary-focus' : '#5b769a',
           'secondary-content' : '#ffffff',

           'accent' : '#67cba0',
           'accent-focus' : '#41be88',
           'accent-content' : '#ffffff',

           'neutral' : '#161827',
           'neutral-focus' : '#06060a',
           'neutral-content' : '#eaf0f6',

           'base-100' : '#ffffff',
           'base-200' : '#f7fafd',
           'base-300' : '#eaf0f6',
           'base-content' : '#161827',

           'info' : '#1c92f2',
           'success' : '#009485',
           'warning' : '#ff9900',
           'error' : '#ff5724',

          '--rounded-box': '1rem',          
          '--rounded-btn': '.5rem',        
          '--rounded-badge': '.5rem',      

          '--animation-btn': '150ms',       
          '--animation-input': '100ms',       

          '--btn-text-case': 'uppercase',   
          '--navbar-padding': '.5rem',      
          '--border-btn': '1px',            
        },
      },
    , "business"],
    darkTheme: "business"
  }
}

