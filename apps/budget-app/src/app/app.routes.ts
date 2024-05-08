import { Route } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { HomePage } from './pages/home/home.page';
import { AuthGuard } from '@budget-app/auth';
import { LoggedInPage } from './pages/logged-in/logged-in.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LoggedInPage,
    children: [{ path: 'home', component: HomePage }],
  },
];
