import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';

@Component({
  selector: 'app-sistema',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './sistema.html',
  styleUrl: './sistema.css',
})
export class Sistema {
  constructor(private router: Router) {}

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}
