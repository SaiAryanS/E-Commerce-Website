import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-list-container">
      <h2>All Kits</h2>
      <div class="product-grid">
        <div class="product-card" *ngFor="let product of products$ | async">
          <a [routerLink]="['/kit', product.slug]">
            <img [src]="product.image_url" [alt]="product.name">
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price | currency }}</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./product-list.component.css']
})
export class ProductListPageComponent implements OnInit {
  products$!: Observable<any[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }
}
