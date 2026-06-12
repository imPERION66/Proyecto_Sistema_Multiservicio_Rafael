import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto implements OnInit {
  filtroBusqueda = '';
  categoriaSeleccionada = 'Todas';
  productos: any[] = [];
  categorias: string[] = ['Todas'];
  mostrarModalRuta = false;

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);
  private URL_API = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient, public router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url = e.urlAfterRedirects || e.url || '';
        this.mostrarModalRuta =
          url.includes('agregar-producto') ||
          url.includes('editar-producto');
        if (!this.mostrarModalRuta) this.cargarProductos();
      });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarProductos();
      this.cargarCategorias();
    }
  }

  cargarProductos() {
    this.http.get<any[]>(`${this.URL_API}/listar`).subscribe({
      next: (data) => { this.productos = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  cargarCategorias() {
    this.http.get<any[]>(`${this.URL_API}/categorias`).subscribe({
      next: (data) => {
        this.categorias = ['Todas', ...data.map((c: any) => c.nombre)];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  get productosFiltrados() {
    return this.productos.filter((p: any) => {
      const matchBusqueda =
        p.nombre?.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        p.codigo?.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      const matchCategoria =
        this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return matchBusqueda && matchCategoria;
    });
  }

  abrirModal() {
    this.router.navigate(['/sistema/producto/agregar-producto']);
  }

  abrirModalEdit(producto: any) {
    this.router.navigate(
      ['/sistema/producto/editar-producto', producto.codigo],
      { state: { producto } }
    );
  }

  eliminarProducto(codigo: string) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `El producto ${codigo} será retirado del inventario.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff3b30',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.URL_API}/eliminar/${codigo}`, { responseType: 'text' }).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Producto eliminado', timer: 1800, showConfirmButton: false });
            this.cargarProductos();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el producto.', 'error')
        });
      }
    });
  }
}