import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
<nav class="navbar">
  <div class="navbar-container">
    <a class="navbar-brand" routerLink="/">The Home Office Kit</a>
    <div class="navbar-links">
      <a routerLink="/kits">Kits</a>
      <ng-container *ngIf="isLoggedIn$ | async; else loggedOut">
        <a (click)="logout()" style="cursor: pointer;">Logout</a>
        <a routerLink="/cart" class="cart-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <span class="cart-count" *ngIf="(cartCount$ | async)?.length">{{ (cartCount$ | async)?.length }}</span>
        </a>
      </ng-container>
      <ng-template #loggedOut>
        <a routerLink="/login">Login</a>
        <a routerLink="/register">Register</a>
      </ng-template>
    </div>
  </div>
</nav>
`,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn$ = this.authService.isLoggedIn$;
  cartCount$ = this.cartService.cartItems$;

  constructor(
    private authService: AuthService, 
    private cartService: CartService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
