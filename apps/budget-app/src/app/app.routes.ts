import { Route } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { OverviewPage } from './pages/overview/overview.page';
import { AuthGuard } from '@budget-app/auth';
import { LoggedInPage } from './pages/logged-in/logged-in.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { WalletsPage } from './pages/wallets/wallets.page';

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
    ],
  },
];
