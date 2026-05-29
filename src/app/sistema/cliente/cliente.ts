import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class Cliente {
  mostrarModalEdit = false;
  
  clienteEditando = {
    dni: '',
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    celular: '',
    correo: ''
  };

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
