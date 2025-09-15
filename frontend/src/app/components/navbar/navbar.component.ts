import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a class="navbar-brand" routerLink="/">The Home Office Kit</a>
        
        <!-- Hamburger Menu Button -->
        <button class="hamburger" (click)="toggleMenu()" [class.is-active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Desktop Links -->
        <div class="navbar-links">
          <a routerLink="/kits">Kits</a>
          <ng-container *ngIf="(isLoggedIn$ | async); else loggedOutDesktop">
            <a routerLink="/my-orders">My Orders</a>
            <a (click)="logout()" class="logout-link">Logout</a>
            <a routerLink="/cart" class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cart-count" *ngIf="(itemCount$ | async) as count">
                <ng-container *ngIf="count > 0">{{ count }}</ng-container>
              </span>
            </a>
          </ng-container>
          <ng-template #loggedOutDesktop>
            <a routerLink="/login">Login</a>
            <a routerLink="/register">Register</a>
            <a routerLink="/admin/login">Admin</a>
          </ng-template>
        </div>

      </div>
      
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.is-active]="isMenuOpen">
        <a routerLink="/kits" (click)="closeMenu()">Kits</a>
        <ng-container *ngIf="(isLoggedIn$ | async); else loggedOutMobile">
          <a routerLink="/my-orders" (click)="closeMenu()">My Orders</a>
          <a (click)="logout()">Logout</a>
        </ng-container>
        <ng-template #loggedOutMobile>
          <a routerLink="/login" (click)="closeMenu()">Login</a>
          <a routerLink="/register" (click)="closeMenu()">Register</a>
          <a routerLink="/admin/login" (click)="closeMenu()">Admin</a>
        </ng-template>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn$: Observable<boolean>;
  itemCount$: Observable<number>;
  isMenuOpen = false;

  constructor(
    private authService: AuthService, 
    private cartService: CartService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.itemCount$ = this.cartService.itemCount$;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}