import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h2>Your Cart</h2>
      <div *ngIf="(cartItems$ | async)?.length; else emptyCart">
        <div class="cart-item" *ngFor="let item of cartItems$ | async">
          <span>{{ item.name }}</span>
          <input type="number" [value]="item.quantity" (change)="updateQuantity(item.id, $event)" min="1">
          <span>{{ (item.price * item.quantity) | currency }}</span>
          <button (click)="removeFromCart(item.id)">Remove</button>
        </div>
        <div class="cart-total">
          <h3>Total: {{ cartTotal$ | async | currency }}</h3>
          <a routerLink="/checkout" class="checkout-button">Proceed to Checkout</a>
        </div>
      </div>
      <ng-template #emptyCart>
        <p>Your cart is empty.</p>
      </ng-template>
    </div>
  `,
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );

  constructor(private cartService: CartService) {}

  updateQuantity(id: number, event: any) {
    const quantity = parseInt((event.target as HTMLInputElement).value, 10);
    this.cartService.updateQuantity(id, quantity);
  }

  removeFromCart(id: number) {
    this.cartService.removeFromCart(id);
  }
}
