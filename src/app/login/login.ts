import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  login_validacion = true;
  ocultarContrasena = true;
  olvide_contrasena = false;
  mensaje_texto = '';
  inputBloqueados = true;
  txtusuario = '';
  txtcontrasena = '';
  txtConfirmarContrasena = '';
  codigoVerificacion = '';
  codigoEnviado = false;
  usuarioValidado = false;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}
  private URL_API = 'http://localhost:8080/login';
  private URL_AUTH = 'http://localhost:8080/auth'; // Nueva URL para validaciones

  check() {
    this.ocultarContrasena = !this.ocultarContrasena;
  }

  click_Olvide_contrasena() {
    if (!this.txtusuario) {
      Swal.fire('Atención', 'Por favor ingresa tu usuario para recuperar la contraseña', 'info');
      return;
    }

    // Validar usuario en el backend
    this.http.get(`${this.URL_AUTH}/validar-usuario/${this.txtusuario}`, { responseType: 'text' }).subscribe({
      next: (resp) => {
        if (resp === 'USUARIO_EXISTE') {
          this.enviarCodigo();
        } else {
          Swal.fire('Error', 'El usuario ingresado no existe en el sistema', 'error');
        }
      },
      error: () => {
        // Simulación por ahora si el backend no está listo
        this.enviarCodigo();
      }
    });
  }

  enviarCodigo() {
    this.http.post(`${this.URL_AUTH}/enviar-codigo`, { usuario: this.txtusuario }, { responseType: 'text' }).subscribe({
      next: (resp) => {
        if (resp === 'CODIGO_ENVIADO') {
          this.olvide_contrasena = true;
          this.login_validacion = false;
          this.codigoEnviado = true;
          this.mensaje_texto = `Se envió un código de 6 dígitos a tu número registrado`;
          Swal.fire('Éxito', 'Código de verificación enviado', 'success');
        } else {
          Swal.fire('Error', 'No se pudo enviar el código de verificación. Contacta a soporte.', 'error');
        }
      },
      error: () => {
        // Simulación exitosa para el frontend
        this.olvide_contrasena = true;
        this.login_validacion = false;
        this.codigoEnviado = true;
        this.mensaje_texto = `Se envió un código de 6 dígitos al número asociado al usuario ${this.txtusuario}`;
      }
    });
  }

  onCodigoChange() {
    if (this.codigoVerificacion.length === 6) {
      this.validarCodigo();
    }
  }

  validarCodigo() {
    this.http.post(`${this.URL_AUTH}/validar-codigo`, { 
      usuario: this.txtusuario, 
      codigo: this.codigoVerificacion 
    }, { responseType: 'text' }).subscribe({
      next: (resp) => {
        if (resp === 'CODIGO_VALIDO') {
          this.usuarioValidado = true;
          this.inputBloqueados = false;
          Swal.fire('Validado', 'Código correcto. Ya puedes cambiar tu contraseña.', 'success');
        } else {
          Swal.fire('Error', 'El código ingresado es incorrecto o ha expirado', 'error');
          this.codigoVerificacion = '';
        }
      },
      error: () => {
        // Simulación: si el código es 123456
        if (this.codigoVerificacion === '123456') {
          this.usuarioValidado = true;
          this.inputBloqueados = false;
          Swal.fire('Validado', 'Código correcto (Simulación)', 'success');
        } else {
          Swal.fire('Error', 'Código incorrecto (Usa 123456 para pruebas)', 'error');
        }
      }
    });
  }

  registra() {
    if (this.txtcontrasena !== this.txtConfirmarContrasena) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.http.post(`${this.URL_AUTH}/actualizar-password`, {
      usuario: this.txtusuario,
      nuevaPassword: this.txtcontrasena
    }, { responseType: 'text' }).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Contraseña actualizada!',
          text: 'Ya puedes iniciar sesión con tu nueva clave.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });
        this.olvide_contrasena = false;
        this.login_validacion = true;
        this.inputBloqueados = true;
        this.usuarioValidado = false;
        this.codigoEnviado = false;
        this.codigoVerificacion = '';
      }
    });
  }
  inicio_sistema() {
    if (!this.txtusuario || !this.txtcontrasena) {
      Swal.fire('Error', 'Por favor ingresa usuario y contraseña', 'warning');
      return;
    }
    const arregloCredenciales: string[] = [this.txtusuario, this.txtcontrasena];
    this.http.post(this.URL_API, arregloCredenciales, { responseType: 'text' }).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del sistema Java:', respuesta);

        if (respuesta === 'OK_PROCESADO') {
          this.txtusuario = '';
          this.txtcontrasena = '';
          this.router.navigate(['/sistema']);
        } else {
          Swal.fire('Error', 'Credenciales incorrectas para el sistema', 'error');
        }
      },
      error: (err) => {
        console.error('Error de conexión:', err);
        Swal.fire('Error', 'No se pudo conectar con el backend de Spring Boot', 'error');
      },
    });
  }
}
