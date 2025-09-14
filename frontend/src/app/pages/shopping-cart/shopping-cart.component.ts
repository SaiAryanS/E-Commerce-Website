import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <h2>Your Shopping Cart</h2>
      <div *ngIf="(cartItems$ | async) as items">
        <div *ngIf="items.length === 0; else cartContent" class="empty-cart">
          <p>Your cart is empty.</p>
          <a routerLink="/kits" class="button">Continue Shopping</a>
        </div>

        <ng-template #cartContent>
          <div class="cart-item" *ngFor="let item of items">
            <img [src]="item.product.image_url" [alt]="item.product.name" class="item-image">
            <div class="item-details">
              <!-- THE FIX: Access product properties via item.product -->
              <span>{{ item.product.name }}</span>
              <input 
                type="number" 
                [value]="item.quantity" 
                (change)="updateQuantity(item.product.id, $event)" 
                min="1"
                class="quantity-input"
              >
              <span>{{ (item.product.price * item.quantity) | currency:'USD' }}</span>
              <button class="remove-btn" (click)="removeFromCart(item.product.id)">Remove</button>
            </div>
          </div>
          <div class="cart-summary">
            <h3>Total: {{ (totalPrice$ | async) | currency:'USD' }}</h3>
            <a routerLink="/checkout" class="button checkout-btn">Proceed to Checkout</a>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;
    this.totalPrice$ = this.cartService.totalPrice$;
  }

  updateQuantity(id: number, event: any): void {
    const quantity = parseInt((event.target as HTMLInputElement).value, 10);
    this.cartService.updateQuantity(id, quantity);
  }

  removeFromCart(id: number): void {
    this.cartService.removeFromCart(id);
  }
}
