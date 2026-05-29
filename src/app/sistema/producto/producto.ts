import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto {
  filtroBusqueda: string = '';
  categoriaSeleccionada: string = 'Todas';
  mostrarModal = false;
  mostrarModalEdit = false;

  categorias = ['Todas', 'Lubricantes', 'Repuestos', 'Filtros', 'Neumáticos', 'Frenos'];

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

  productos = [
    {
      codigo: 'ACE-001',
      nombre: 'Aceite Motor 10W40',
      marca: 'Castrol',
      categoria: 'Lubricantes',
      stock: 15,
      stock_minimo: 10,
      precio_venta: 35.50,
      estado: 'Activo'
    },
    {
      codigo: 'FIL-002',
      nombre: 'Filtro de Aire Premium',
      marca: 'Bosch',
      categoria: 'Filtros',
      stock: 5,
      stock_minimo: 12,
      precio_venta: 18.00,
      estado: 'Activo'
    },
    {
      codigo: 'PAS-003',
      nombre: 'Pastillas de Freno',
      marca: 'Brembo',
      categoria: 'Frenos',
      stock: 20,
      stock_minimo: 8,
      precio_venta: 120.00,
      estado: 'Activo'
    }
  ];

  get productosFiltrados() {
    return this.productos.filter(p => {
      const matchBusqueda = p.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) || 
                           p.codigo.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const matchCategoria = this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    });
  }
}
