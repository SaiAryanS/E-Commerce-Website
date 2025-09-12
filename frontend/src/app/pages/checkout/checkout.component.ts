import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-container">
      <h2>Order Summary</h2>
      <div *ngIf="!(orderPlaced)">
        <div class="order-item" *ngFor="let item of cartItems$ | async">
          <span>{{ item.name }} (x{{ item.quantity }})</span>
          <span>{{ (item.price * item.quantity) | currency }}</span>
        </div>
        <hr>
        <div class="order-total">
          <h3>Total: {{ cartTotal$ | async | currency }}</h3>
        </div>
        <button (click)="placeOrder()">Place Order</button>
      </div>
      <div *ngIf="orderPlaced" class="order-success">
        <h3>Thank you for your order!</h3>
        <p>Your order has been placed successfully.</p>
      </div>
    </div>
  `,
  styleUrls: ['./checkout.component.css']
})
export class CheckoutPageComponent {
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartItems$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );
  orderPlaced = false;

  constructor(private cartService: CartService, private router: Router) {}

  placeOrder() {
    this.cartService.clearCart();
    this.orderPlaced = true;
    setTimeout(() => {
        this.router.navigate(['/']);
    }, 3000);
  }
}
