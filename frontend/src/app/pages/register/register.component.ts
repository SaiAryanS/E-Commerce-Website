import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="form-container">
      <h2>Create Account</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password">
        </div>
        <button type="submit" [disabled]="registerForm.invalid">Register</button>
        <p class="auth-switch">Already have an account? <a routerLink="/login">Login</a></p>
      </form>
    </div>
  `,
  styleUrls: ['./register.component.css']
})
export class RegisterPageComponent {
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Registration failed', err)
      });
    }
  }
}
