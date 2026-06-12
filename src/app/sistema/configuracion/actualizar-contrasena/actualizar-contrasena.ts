import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-contrasena.html',
  styleUrl: './actualizar-contrasena.css',
})
export class ActualizarContrasena {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private URL_API = 'http://localhost:8080/api/auth';

  contrasenaActual: string = '';
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  actualizando: boolean = false;

  obtenerUsuarioLogueado(): string {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user.username || '';
    } catch {
      return '';
    }
  }

  validarFormulario(): boolean {
    if (!this.contrasenaActual || !this.nuevaContrasena || !this.confirmarContrasena) {
      Swal.fire('Campos incompletos', 'Por favor complete todos los campos', 'warning');
      return false;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      Swal.fire('Contraseñas no coinciden', 'La nueva contraseña y la confirmación deben ser iguales', 'warning');
      return false;
    }

    if (this.nuevaContrasena.length < 6) {
      Swal.fire('Contraseña muy corta', 'La nueva contraseña debe tener al menos 6 caracteres', 'warning');
      return false;
    }

    return true;
  }

  actualizarContrasena() {
    if (!this.validarFormulario()) return;

    this.actualizando = true;
    const usuario = this.obtenerUsuarioLogueado();

    const payload = {
      usuario: usuario,
      contrasenaActual: this.contrasenaActual,
      nuevaContrasena: this.nuevaContrasena,
    };

    this.http.post(`${this.URL_API}/actualizar-contrasena`, payload, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.actualizando = false;
        if (response === 'CONTRASENA_ACTUALIZADA') {
          Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success').then(() => {
            this.cerrar();
          });
        } else {
          Swal.fire('Error', response || 'No se pudo actualizar la contraseña', 'error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actualizando = false;
        const msg = err.error || 'No se pudo actualizar la contraseña';
        Swal.fire('Error', msg, 'error');
        this.cdr.detectChanges();
      },
    });
  }

  cerrar() {
    this.router.navigate(['/sistema/configuracion']);
  }
}
