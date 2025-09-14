import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="management-container">
      <h2>Product Management</h2>

      <!-- Form for Adding a New Product -->
      <div class="form-card">
        <h3>Add New Product</h3>
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Product Name</label>
              <input id="name" type="text" formControlName="name">
            </div>
            <div class="form-group">
              <label for="slug">Slug (e.g., starter-kit)</label>
              <input id="slug" type="text" formControlName="slug">
            </div>
            <div class="form-group full-width">
              <label for="description">Description</label>
              <textarea id="description" formControlName="description"></textarea>
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input id="price" type="number" formControlName="price">
            </div>
            <div class="form-group">
              <label for="image_url">Image URL (e.g., /assets/images/kit.jpg)</label>
              <input id="image_url" type="text" formControlName="image_url">
            </div>
          </div>
          <button type="submit" [disabled]="productForm.invalid">Add Product</button>
        </form>
      </div>

      <!-- List of Existing Products -->
      <div class="list-card">
        <h3>Existing Products</h3>
        <div *ngIf="isLoading">Loading products...</div>
        <div *ngIf="!isLoading && products.length === 0">No products found.</div>
        <table *ngIf="!isLoading && products.length > 0" class="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.price | currency:'USD' }}</td>
              <td>
                <button class="delete-btn" (click)="deleteProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  productForm = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    image_url: ['', Validators.required],
  });

  products: Product[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const newProductData = {
      name: this.productForm.value.name!,
      slug: this.productForm.value.slug!,
      description: this.productForm.value.description!,
      price: this.productForm.value.price!,
      image_url: this.productForm.value.image_url!,
    };

    this.productService.addProduct(newProductData).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.productForm.reset();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Failed to add product', err);
        alert('Error adding product. Please check the console.');
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          alert('Error deleting product. Please check the console.');
        }
      });
    }
  }
}

