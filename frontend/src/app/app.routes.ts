import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';
import { ProductListPageComponent } from './pages/product-list/product-list.component';
import { ProductDetailsPageComponent } from './pages/product-details/product-details.component';
import { LoginPageComponent } from './pages/login/login.component';
import { RegisterPageComponent } from './pages/register/register.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { CheckoutPageComponent } from './pages/checkout/checkout.component';

export const appRoutes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'kits', component: ProductListPageComponent },
    { path: 'kit/:slug', component: ProductDetailsPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'checkout', component: CheckoutPageComponent },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
