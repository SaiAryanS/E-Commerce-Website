import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="product-management-container">
      <h3>Add New Product</h3>
      <form [formGroup]="productForm" (ngSubmit)="onAddProduct()" class="add-product-form">
        <input formControlName="name" placeholder="Name">
        <input formControlName="slug" placeholder="Slug">
        <input formControlName="price" type="number" placeholder="Price">
        <textarea formControlName="description" placeholder="Description"></textarea>
        <textarea formControlName="items_included" placeholder="Items (comma-separated)"></textarea>
        <input formControlName="image_url" placeholder="Image URL">
        <button type="submit" [disabled]="productForm.invalid">Add Product</button>
      </form>

      <h3>Existing Products</h3>
      <table class="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of products$ | async">
            <td>{{ product.name }}</td>
            <td>{{ product.price | currency }}</td>
            <td>
              <button (click)="onDeleteProduct(product.id)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products$!: Observable<any[]>;
  productForm = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    description: ['', Validators.required],
    items_included: ['', Validators.required],
    price: [null, Validators.required],
    image_url: ['', Validators.required]
  });

  constructor(private productService: ProductService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this.productService.getProducts();
  }

  onAddProduct() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe(() => {
        this.loadProducts();
        this.productForm.reset();
      });
    }
  }

  onDeleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
