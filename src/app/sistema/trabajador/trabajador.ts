import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajador',
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador.html',
  styleUrl: './trabajador.css',
})
export class Trabajador implements OnInit {
  mostrarModal = false;
  mostrarModalEdit = false;
  mostrarCamposUsuario = false;
  filtroBusqueda: string = '';
  cargoSeleccionado: string = '';
  trabajadores: any[] = [];
  documentos: any[] = [];
  cargos: any[] = [];
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  private URL_API = 'http://localhost:8080/api/trabajadores';

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
    estado: 'Activo',
    usuario: '',
    contrasena: '',
  };

  // Objeto para manejar la edición
  trabajadorEditando: any = {};

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarTrabajadores();
      this.cargarDocumentos();
      this.cargarCargos();
    }
  }

  cargarTrabajadores() {
    this.http.get<any[]>(`${this.URL_API}/listar`).subscribe({
      next: (data) => {
        this.trabajadores = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar trabajadores:', err),
    });
  }

  cargarDocumentos() {
    this.http.get<any[]>(`${this.URL_API}/documentos`).subscribe({
      next: (data) => {
        this.documentos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar documentos:', err),
    });
  }

  cargarCargos() {
    this.http.get<any[]>(`${this.URL_API}/cargos`).subscribe({
      next: (data) => {
        this.cargos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar cargos:', err),
    });
  }

  onCargoChange() {
    // Show username/password fields only for Administrador (id: 2) or Vendedor (id: 3)
    this.mostrarCamposUsuario =
      this.nuevoTrabajador.id_cargo === 2 || this.nuevoTrabajador.id_cargo === 3;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.mostrarCamposUsuario = false;
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
      estado: 'Activo',
      usuario: '',
      contrasena: '',
    };
    this.mostrarCamposUsuario = false;
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
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('Enviando petición de eliminación al backend (DELETE /trabajador/' + id + ')');
        Swal.fire('Eliminado', 'El trabajador ha sido eliminado del sistema', 'success');
      }
    });
  }
}
