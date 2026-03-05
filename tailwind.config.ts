import { FIVE_COLORS } from "./app/utils/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      colors: {
        'mind': FIVE_COLORS.MIND,
        'body': FIVE_COLORS.BODY,
        'cash': FIVE_COLORS.CASH,
        'work': FIVE_COLORS.WORK,
        'bond': FIVE_COLORS.BOND,
        'total': FIVE_COLORS.TOTAL,
        'neutral': '#f3eae3'
      }
    }
  }
}