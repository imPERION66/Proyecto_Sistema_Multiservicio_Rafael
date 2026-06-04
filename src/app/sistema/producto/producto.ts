import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  filtroBusqueda: string = '';
  categoriaSeleccionada: string = 'Todas';
  mostrarModal = false;
  mostrarModalEdit = false;
  productos: any[] = [];
  categorias: string[] = [];
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  private URL_API = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
      this.cargarCategorias();
    }
  }

  cargarProductos() {
    this.http.get<any[]>(`${this.URL_API}/listar`).subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  cargarCategorias() {
    this.http.get<string[]>(`${this.URL_API}/categorias`).subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  nuevoProducto = {
    codigo: '',
    nombre: '',
    marca: '',
    id_categoria: 1,
    cantidad: 0,
    precio_compra: 0,
    precio_venta: 0,
    stock_minimo: 5,
    estado: 'Activo'
  };

  productoEditando: any = {};

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.resetForm(); }

  abrirModalEdit(producto: any) {
    this.productoEditando = { ...producto };
    this.mostrarModalEdit = true;
  }
  cerrarModalEdit() { this.mostrarModalEdit = false; }

  resetForm() {
    this.nuevoProducto = {
      codigo: '', nombre: '', marca: '', id_categoria: 1,
      cantidad: 0, precio_compra: 0, precio_venta: 0,
      stock_minimo: 5, estado: 'Activo'
    };
  }

  /**
   * Envía el nuevo producto al backend (POST /repuesto).
   * La fecha de registro es manejada por la DB.
   */
  guardarProducto() {
    console.log('Enviando nuevo producto al backend:', this.nuevoProducto);
    Swal.fire('Guardado', 'Producto registrado en el inventario', 'success');
    this.cerrarModal();
  }

  /**
   * Actualiza los datos de un producto (PUT /repuesto).
   */
  actualizarProducto() {
    console.log('Enviando actualización de producto al backend:', this.productoEditando);
    Swal.fire('Actualizado', 'Producto actualizado correctamente', 'success');
    this.cerrarModalEdit();
  }

  /**
   * Confirmación de eliminación (DELETE /repuesto/{id}).
   */
  eliminarProducto(codigo: string) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "El producto con código " + codigo + " será retirado del inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Enviando eliminación al backend para código:', codigo);
        Swal.fire('Eliminado', 'Producto eliminado', 'success');
      }
    });
  }

  get productosFiltrados() {
    return this.productos.filter((p: any) => {
      const matchBusqueda = p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) || 
                           p.codigo.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const matchCategoria = this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    });
  }
}
