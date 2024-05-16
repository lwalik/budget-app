import { Route } from '@angular/router';
import { AuthGuard } from '@budget-app/auth';
import { LoadUserProductsResolver } from '@budget-app/user-products';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { ExpensesPage } from './pages/expenses/expenses.page';
import { LoggedInPage } from './pages/logged-in/logged-in.page';
import { LoginPage } from './pages/login/login.page';
import { OverviewPage } from './pages/overview/overview.page';
import { UserProductsPage } from './pages/user-products/user-products.page';
import { WalletsPage } from './pages/wallets/wallets.page';
import { LoadExpensesResolver } from '../../../../libs/expenses/src/lib/resolvers/load-expenses.resolver';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LoggedInPage,
    children: [
      { path: 'overview', component: OverviewPage },
      { path: 'wallets', component: WalletsPage },
      {
        path: 'products',
        component: UserProductsPage,
        resolve: [LoadUserProductsResolver],
      },
      {
        path: 'expenses',
        component: ExpensesPage,
        resolve: [LoadExpensesResolver],
      },
    ],
  },
];
