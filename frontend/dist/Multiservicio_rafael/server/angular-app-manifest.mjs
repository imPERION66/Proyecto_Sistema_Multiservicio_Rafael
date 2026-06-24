
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 0,
    "redirectTo": "/sistema/dashboard",
    "route": "/sistema"
  },
  {
    "renderMode": 0,
    "route": "/sistema/dashboard"
  },
  {
    "renderMode": 0,
    "route": "/sistema/cliente"
  },
  {
    "renderMode": 0,
    "route": "/sistema/cliente/agregar-cliente"
  },
  {
    "renderMode": 0,
    "route": "/sistema/cliente/editar-cliente"
  },
  {
    "renderMode": 0,
    "route": "/sistema/producto"
  },
  {
    "renderMode": 0,
    "route": "/sistema/producto/agregar-producto"
  },
  {
    "renderMode": 0,
    "route": "/sistema/producto/editar-producto/*"
  },
  {
    "renderMode": 0,
    "route": "/sistema/reabastecimiento"
  },
  {
    "renderMode": 0,
    "route": "/sistema/servicio"
  },
  {
    "renderMode": 0,
    "route": "/sistema/servicio/ventas"
  },
  {
    "renderMode": 0,
    "route": "/sistema/servicio/crearVenta"
  },
  {
    "renderMode": 0,
    "route": "/sistema/servicio/mantenimiento"
  },
  {
    "renderMode": 0,
    "route": "/sistema/configuracion"
  },
  {
    "renderMode": 0,
    "route": "/sistema/configuracion/rol"
  },
  {
    "renderMode": 0,
    "route": "/sistema/configuracion/rol/agregar-rol"
  },
  {
    "renderMode": 0,
    "route": "/sistema/configuracion/rol/editar-rol/*"
  },
  {
    "renderMode": 0,
    "route": "/sistema/configuracion/actualizar-contrasena"
  },
  {
    "renderMode": 0,
    "route": "/sistema/trabajador"
  },
  {
    "renderMode": 0,
    "route": "/sistema/trabajador/agregar-trabajador"
  },
  {
    "renderMode": 0,
    "route": "/sistema/trabajador/editar-trabajador"
  },
  {
    "renderMode": 0,
    "route": "/sistema/proveedor"
  },
  {
    "renderMode": 0,
    "route": "/sistema/proveedor/agregar-proveedor"
  },
  {
    "renderMode": 0,
    "route": "/sistema/proveedor/editar-proveedor/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 982, hash: 'f4bf3d4cb0ecd0079def3f0b3926f2d12236b2c1f4146652b51f7c51327c2e49', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1495, hash: '4171dc320eef342238795cdc38cbb155785a2b0f0ff4fdc31bfd32dda9e945ff', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
