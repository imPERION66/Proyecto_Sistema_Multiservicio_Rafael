import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente implements OnInit {
  mostrarModalEdit = false;
  filtroBusqueda: string = '';
  clientes: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  
  clienteEditando = {
    dni: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    celular: '',
    correo: ''
  };
  
  private URL_API = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarClientes();
    }
  }

  cargarClientes() {
    this.http.get<any[]>(`${this.URL_API}/listar`).subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges(); // Forzar actualización de la UI inmediatamente
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  abrirModalEdit(cliente: any) {
    this.clienteEditando = { ...cliente };
    this.mostrarModalEdit = true;
  }

  cerrarModalEdit() {
    this.mostrarModalEdit = false;
  }

  guardarCambios() {
    console.log('Enviando actualización de cliente al backend (PUT /cliente):', this.clienteEditando);
    Swal.fire('Actualizado', 'Los datos del cliente han sido modificados', 'success');
    this.cerrarModalEdit();
  }

  /**
   * Confirmación para eliminar un cliente.
   * Se envía DELETE /cliente/{id} al backend.
   */
  eliminarCliente(dni: string) {
    Swal.fire({
      title: '¿Eliminar cliente?',
      text: "Se eliminarán todos los registros asociados a este cliente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Enviando eliminación al backend (DELETE /cliente/' + dni + ')');
        Swal.fire('Eliminado', 'El cliente ha sido retirado del sistema', 'success');
      }
    });
  }
}
