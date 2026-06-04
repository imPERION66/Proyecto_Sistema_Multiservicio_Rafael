import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
  
  // Métodos para manejar los formularios mediante SweetAlert2 (Modales dinámicos)
  
  abrirRecuperarContrasena() {
    Swal.fire({
      title: 'Recuperar Contraseña',
      html: `
        <input type="text" id="user_rec" class="swal2-input" placeholder="Usuario">
        <p class="small text-muted mt-2">Se enviará un código al número registrado.</p>
      `,
      confirmButtonText: 'Siguiente',
      showCancelButton: true,
      preConfirm: () => {
        const user = (Swal.getPopup()?.querySelector('#user_rec') as HTMLInputElement).value;
        if (!user) Swal.showValidationMessage('Ingresa el usuario');
        return { user };
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire('Éxito', 'Código enviado correctamente', 'success');
      }
    });
  }

  abrirAgregarRoles() {
    Swal.fire({
      title: 'Nuevo Rol de Usuario',
      html: `
        <input type="text" id="rol_name" class="swal2-input" placeholder="Nombre del Rol">
        <div class="mt-3 text-start px-3">
          <label class="small fw-bold">Permisos:</label><br>
          <input type="checkbox"> Ventas <br>
          <input type="checkbox"> Inventario <br>
          <input type="checkbox"> Usuarios
        </div>
      `,
      confirmButtonText: 'Guardar Rol',
      showCancelButton: true
    });
  }

  abrirCategoriasProductos() {
    Swal.fire({
      title: 'Gestionar Categorías',
      input: 'text',
      inputLabel: 'Nueva Categoría de Producto',
      inputPlaceholder: 'Ej: Lubricantes Especiales',
      showCancelButton: true,
      confirmButtonText: 'Agregar'
    });
  }

  abrirAgregarTipoDocumento() {
    Swal.fire({
      title: 'Tipo de Documento',
      html: `
        <input type="text" id="doc_name" class="swal2-input" placeholder="Nombre (DNI, RUC, etc.)">
        <input type="number" id="doc_len" class="swal2-input" placeholder="Longitud de caracteres">
      `,
      confirmButtonText: 'Registrar',
      showCancelButton: true
    });
  }

  abrirEditarTipoDocumento() {
    Swal.fire({
      title: 'Editar Tipo de Documento',
      html: `
        <select id="doc_select" class="swal2-input">
          <option value="1">DNI</option>
          <option value="2">RUC</option>
        </select>
        <input type="text" id="doc_name_edit" class="swal2-input" placeholder="Nuevo Nombre">
      `,
      confirmButtonText: 'Guardar Cambios',
      showCancelButton: true
    });
  }
}
