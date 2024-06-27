import { Route } from '@angular/router';
import { AuthGuard } from '@budget-app/auth';
import { LoadExpensesResolver } from '@budget-app/expenses';
import { LoadProductsResolver } from '@budget-app/products';
import { LoadWalletsResolver } from '@budget-app/wallets';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { ExpensesPage } from './pages/expenses/expenses.page';
import { LoggedInPage } from './pages/logged-in/logged-in.page';
import { LoginPage } from './pages/login/login.page';
import { ProductsPage } from './pages/products/products.page';
import { RegisterPage } from './pages/register/register.page';
import { SummaryPage } from './pages/summary/summary.page';
import { WalletsPage } from './pages/wallets/wallets.page';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LoggedInPage,
    resolve: [LoadWalletsResolver, LoadProductsResolver, LoadExpensesResolver],
    children: [
      { path: 'dashboard', component: DashboardPage },
      {
        path: 'wallets',
        component: WalletsPage,
      },
      {
        path: 'products',
        component: ProductsPage,
        resolve: [],
      },
      {
        path: 'expenses',
        component: ExpensesPage,
      },
      {
        path: 'summary',
        component: SummaryPage,
      },
    ],
  },
];
