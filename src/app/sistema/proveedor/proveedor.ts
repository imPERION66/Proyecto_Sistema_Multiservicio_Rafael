import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor.html',
  styleUrl: './proveedor.css',
})
export class Proveedor implements OnInit {
  filtroBusqueda: string = '';
  proveedores: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  private URL_API = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProveedores();
    }
  }

  cargarProveedores() {
    this.http.get<any[]>(`${this.URL_API}/listar`).subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  get proveedoresFiltrados() {
    return this.proveedores.filter(p => 
      p.nombre_empresa.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      p.ruc.includes(this.filtroBusqueda)
    );
  }

  /**
   * Abre una alerta de confirmación para eliminar un proveedor.
   */
  eliminarProveedor(ruc: string) {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: `El proveedor con RUC ${ruc} será retirado del sistema.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', 'El proveedor ha sido eliminado.', 'success');
      }
    });
  }

  /**
   * Simula la edición de un proveedor.
   */
  editarProveedor(prov: any) {
    Swal.fire({
      title: 'Editar Proveedor',
      html: `
        <input id="swal-ruc" class="swal2-input" placeholder="RUC" value="${prov.ruc}" readonly>
        <input id="swal-nombre" class="swal2-input" placeholder="Empresa" value="${prov.nombre_empresa}">
        <input id="swal-tel" class="swal2-input" placeholder="Teléfono" value="${prov.celular}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios'
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Actualizado', 'Datos del proveedor actualizados.', 'success');
      }
    });
  }

  /**
   * Simula la creación de un nuevo proveedor.
   */
  agregarProveedor() {
    Swal.fire({
      title: 'Nuevo Proveedor',
      html: `
        <input id="new-ruc" class="swal2-input" placeholder="RUC">
        <input id="new-nombre" class="swal2-input" placeholder="Nombre de Empresa">
        <input id="new-tel" class="swal2-input" placeholder="Celular">
        <input id="new-correo" class="swal2-input" placeholder="Correo">
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Éxito', 'Proveedor registrado correctamente.', 'success');
      }
    });
  }
}
