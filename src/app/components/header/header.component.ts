import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router) {}

  hideButton(): boolean {
    return this.router.url === '/';
  }

  hideEditcompany(): boolean {
    return this.router.url === '/' || this.router.url === '/';
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
