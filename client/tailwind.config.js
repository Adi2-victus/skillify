// tailwind.config.js
// module.exports = {
//   darkMode: 'class',
//   content: [
//     // your existing content paths
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//       },
//     },
//   },
//   plugins: [],
// }


// module.exports = {
//   // ... other config ...
//   darkMode: 'class',
// }






module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#f1f5f9',  // Light text on dark bg
          200: '#e2e8f0',
          800: '#1e293b',  // Dark backgrounds
          900: '#0f172a',
        }
      }
    }
  }
}
