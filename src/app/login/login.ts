import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  login_validacion = true;
  ocultarContrasena = true;
  olvide_contrasena = false;
  mensaje_texto = '';
  inputBloqueados = true;
  constructor(private router:Router){}
  check() {
    this.ocultarContrasena = !this.ocultarContrasena;
  }
  
  click_Olvide_contrasena() {
    this.olvide_contrasena = true;
    this.login_validacion = false;
    var numer1 = '923093797';
    this.mensaje_texto = `Se envio un codigo de 6 digitos al siguiente numero ${numer1}`;
  }

  registra() {
    Swal.fire({
      title:"¡Contraseña actualizada con éxito!",
      text:"Tu nueva clave de acceso ha sido registrada de forma segura en nuestro sistema. A partir de este momento, deberás utilizar esta nueva credencial para ingresar a tu cuenta. Ya puedes cerrar este aviso e iniciar sesión con total normalidad.",
      timer: 3000,
      showConfirmButton: false,
      background: 'var(--bs-success-bg-subtle)'
    })
    this.olvide_contrasena=false
    this.login_validacion=true
  }
  inicio_sistema(){
    this.router.navigate(['/sistema'])
  }
}