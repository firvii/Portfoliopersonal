import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: [
        'index.html',
        'formacion.html',
        'contacto.html',
        'habilidades.html',
        'proyectos.html',
        'quien-soy.html',
        'aspiraciones.html',
      ]
    }
  }
})
