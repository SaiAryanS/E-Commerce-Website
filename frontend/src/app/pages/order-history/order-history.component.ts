import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="history-container">
      <h2>My Order History</h2>
      
      <div *ngIf="isLoading" class="loading-state">
        <p>Loading your orders...</p>
      </div>

      <div *ngIf="!isLoading && orders.length === 0" class="empty-state">
        <p>You haven't placed any orders yet.</p>
        <a routerLink="/kits" class="button">Start Shopping</a>
      </div>

      <div *ngIf="!isLoading && orders.length > 0" class="orders-list">
        <!-- Loop through each order -->
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-summary">
            <div>
              <span class="label">Order ID:</span>
              <span>#{{ order.id }}</span>
            </div>
            <div>
              <span class="label">Date:</span>
              <span>{{ order.created_at | date:'longDate' }}</span>
            </div>
            <div>
              <span class="label">Total:</span>
              <span class="total-amount">{{ order.total_amount | currency:'USD' }}</span>
            </div>
          </div>
          <hr>
          <!-- Loop through items within each order -->
          <div class="order-items">
            <div class="item" *ngFor="let item of order.items">
              <img [src]="item.image_url" [alt]="item.name" class="item-image">
              <div class="item-details">
                <span class="item-name">{{ item.name }}</span>
                <span>Quantity: {{ item.quantity }}</span>
                <span>Price: {{ item.price_at_purchase | currency:'USD' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .loading-state, .empty-state { text-align: center; padding: 3rem; background: #f9f9f9; border-radius: 8px; }
    .button { background-color: #007bff; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .order-card { background: #fff; border: 1px solid #e9ecef; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .order-summary { display: flex; justify-content: space-between; padding: 1rem 1.5rem; background: #f8f9fa; border-top-left-radius: 8px; border-top-right-radius: 8px; }
    .label { color: #6c757d; margin-right: 0.5rem; }
    .total-amount { font-weight: bold; }
    .order-items { padding: 1.5rem; }
    .item { display: flex; align-items: center; margin-bottom: 1rem; }
    .item:last-child { margin-bottom: 0; }
    .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 1rem; }
    .item-details { display: flex; flex-direction: column; }
    .item-name { font-weight: 600; }
  `]
})
export class OrderHistoryPageComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch order history', err);
        this.isLoading = false;
        // Optionally, show an error message to the user
      }
    });
  }
}
