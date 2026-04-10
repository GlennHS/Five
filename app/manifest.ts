import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FIVE',
    short_name: 'FIVE',
    description: 'Self-care habit tracking fitness app',
    start_url: '/',
    display: 'standalone',
    background_color: '#3b82f6',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}