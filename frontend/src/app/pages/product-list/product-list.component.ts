import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <h2>All Kits</h2>
      <div *ngIf="isLoading" class="loading-indicator">Loading products...</div>
      
      <div *ngIf="!isLoading && products.length === 0">
        <p>No products are available at this time.</p>
      </div>

      <div class="product-grid" *ngIf="!isLoading && products.length > 0">
        <!-- Loop through each product and display it -->
        <div class="product-card" *ngFor="let product of products">
          <a [routerLink]="['/kit', product.slug]">
            <img [src]="product.image_url" [alt]="product.name" class="product-image" onError="this.src='https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found'">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price | currency:'USD' }}</p>
          </a>
        </div>
      </div>
    </div>
  `,
  // You would create a corresponding CSS file for this component to style it
  styleUrls: ['./product-list.component.css'] 
})
export class ProductListPageComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch products', err);
        this.isLoading = false;
      }
    });
  }
}

