import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card">
        <div class="icon-container">
          <!-- Green checkmark icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1>Thank You For Your Order!</h1>
        <p class="subtitle">Your order has been placed successfully and is being processed.</p>
        <div *ngIf="orderId" class="order-id-box">
          Your Order ID is: <strong>#{{ orderId }}</strong>
        </div>
        <a routerLink="/kits" class="button">Continue Shopping</a>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4rem 1rem;
      text-align: center;
    }
    .confirmation-card {
      background-color: #ffffff;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      max-width: 500px;
    }
    .icon-container {
      margin-bottom: 1.5rem;
    }
    .success-icon {
      width: 6rem;
      height: 6rem;
      color: #28a745; /* A nice green color */
    }
    h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.1rem;
      color: #6c757d;
      margin-bottom: 2rem;
    }
    .order-id-box {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
      font-size: 1rem;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: background-color 0.2s ease-in-out;
    }
    .button:hover {
      background-color: #0056b3;
    }
  `]
})
export class OrderConfirmationPageComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // This gets the order ID from the URL (e.g., /order-confirmation/123)
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}
