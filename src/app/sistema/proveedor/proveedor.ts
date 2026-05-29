import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedor',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor.html',
  styleUrl: './proveedor.css',
})
export class Proveedor {
  filtroBusqueda: string = '';
  
  proveedores = [
    {
      ruc: '20123456789',
      nombre_empresa: 'Distribuidora Automotriz S.A.',
      celular: '987654321',
      correo: 'ventas@automotriz.com',
      direccion: 'Av. Las Malvinas 123, Lima',
      estado: 'Activo'
    },
    {
      ruc: '20987654321',
      nombre_empresa: 'Lubricantes Express',
      celular: '912345678',
      correo: 'contacto@lubexpress.pe',
      direccion: 'Jr. Los Olivos 456, Chiclayo',
      estado: 'Activo'
    },
    {
      ruc: '10456789123',
      nombre_empresa: 'Repuestos Juanito',
      celular: '945612378',
      correo: 'juanito@repuestos.com',
      direccion: 'Calle Comercio 789, Trujillo',
      estado: 'Inactivo'
    }
  ];

  get proveedoresFiltrados() {
    return this.proveedores.filter(p => 
      p.nombre_empresa.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      p.ruc.includes(this.filtroBusqueda)
    );
  }
}
