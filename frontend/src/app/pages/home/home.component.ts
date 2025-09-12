import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero">
      <h1>Curated Kits for Your Ideal Home Office.</h1>
      <p>Minimalist, ergonomic, and tech-focused solutions delivered to your door.</p>
      <a routerLink="/kits" class="cta-button">Explore The Kits</a>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomePageComponent {

}
