import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this._cartItems.asObservable();

  constructor() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this._cartItems.next(JSON.parse(cart));
    }
  }

  private persistCart(items: any[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this._cartItems.next(items);
  }

  addToCart(product: any) {
    const currentItems = this._cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }
    this.persistCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number) {
    const currentItems = this._cartItems.value;
    const item = currentItems.find(item => item.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.persistCart(currentItems);
      }
    }
  }

  removeFromCart(productId: number) {
    let currentItems = this._cartItems.value;
    currentItems = currentItems.filter(item => item.id !== productId);
    this.persistCart(currentItems);
  }

  clearCart() {
    this.persistCart([]);
  }

  getCartTotal() {
    return this._cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }
}
