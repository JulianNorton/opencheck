module.exports = {
  purge: ['./views/*.html', './views/*.js', './views/*.ejs'],
  darkMode: false,
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
      '8xl': '6rem',
      '9xl': '8rem',
    },
    extend: {
      backgroundColor: (theme) => theme('colors'),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
