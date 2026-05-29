import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajador',
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador.html',
  styleUrl: './trabajador.css',
})
export class Trabajador {
  mostrarModal = false;
  mostrarModalEdit = false;
  
  // Datos del nuevo trabajador basados en la DB
  nuevoTrabajador = {
    id_documento: 1,
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    celular: '',
    correo: '',
    direccion: '',
    id_cargo: 1,
    estado: 'Activo'
  };

  // Objeto para manejar la edición
  trabajadorEditando: any = {};

  documentos = [
    { id: 1, nombre: 'DNI' },
    { id: 2, nombre: 'Pasaporte' },
    { id: 3, nombre: 'Carnet Extranjería' }
  ];

  cargos = [
    { id: 1, nombre: 'Mecánico' },
    { id: 2, nombre: 'Administrador' },
    { id: 3, nombre: 'Vendedor' }
  ];

  constructor(private router: Router) {}

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.resetForm();
  }

  abrirModalEdit(trabajador: any) {
    this.trabajadorEditando = { ...trabajador };
    this.mostrarModalEdit = true;
  }

  cerrarModalEdit() {
    this.mostrarModalEdit = false;
  }

  resetForm() {
    this.nuevoTrabajador = {
      id_documento: 1,
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      celular: '',
      correo: '',
      direccion: '',
      id_cargo: 1,
      estado: 'Activo'
    };
  }

  /**
   * Lógica para guardar un nuevo trabajador.
   * Se espera que el backend reciba un objeto JSON con los campos de la tabla 'trabajador'.
   */
  guardarTrabajador() {
    console.log('Enviando datos al backend (POST /trabajador):', this.nuevoTrabajador);
    // Simulación de éxito
    Swal.fire('Guardado', 'El trabajador ha sido registrado correctamente', 'success');
    this.cerrarModal();
  }

  /**
   * Lógica para actualizar un trabajador existente.
   * Se envía al backend mediante PUT /trabajador/{id}.
   */
  actualizarTrabajador() {
    console.log('Enviando actualización al backend (PUT /trabajador):', this.trabajadorEditando);
    Swal.fire('Actualizado', 'Los datos del trabajador han sido modificados', 'success');
    this.cerrarModalEdit();
  }

  /**
   * Confirmación para eliminar (desactivar) un trabajador.
   * Usa SweetAlert2 para una experiencia profesional.
   */
  eliminarTrabajador(id: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Enviando petición de eliminación al backend (DELETE /trabajador/' + id + ')');
        Swal.fire('Eliminado', 'El trabajador ha sido eliminado del sistema', 'success');
      }
    });
  }
}
