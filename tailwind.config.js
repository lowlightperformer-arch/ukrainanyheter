module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serifHeadline: ['Playfair Display', 'Merriweather', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
