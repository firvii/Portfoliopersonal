import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: {
        main:          resolve(__dirname, 'index.html'),
        formacion:     resolve(__dirname, 'formacion.html'),
        contacto:      resolve(__dirname, 'contacto.html'),
        habilidades:   resolve(__dirname, 'habilidades.html'),
        proyectos:     resolve(__dirname, 'proyectos.html'),
        quienSoy:      resolve(__dirname, 'quien-soy.html'),
        aspiraciones:  resolve(__dirname, 'aspiraciones.html'),
      }
    }
  }
})
