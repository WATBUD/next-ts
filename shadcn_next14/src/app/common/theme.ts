export const theme = {
  colors: {
    // Background colors
    background: {
      primary: '#f5f5f5',
      transparent: 'rgba(255, 255, 255, 0)',
    },
    // Text colors
    text: {
      primary: '#1f2937', // gray-800
    },
    // Icon colors
    icon: {
      primary: '#4b5563', // gray-600
    },
    // Border colors
    border: {
      light: '#e5e7eb', // gray-200
      medium: '#d1d5db', // gray-300
    },
  },
  // Add more theme properties as needed
} as const;

// Type for the theme
export type Theme = typeof theme; 