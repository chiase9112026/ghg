import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing-layout.component').then(m => m.LandingLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./landing/home/home.component').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./landing/about/about.component').then(m => m.AboutComponent) },
      { path: 'services', loadComponent: () => import('./landing/services/services.component').then(m => m.ServicesComponent) },
      { path: 'hub', loadComponent: () => import('./landing/hub/hub.component').then(m => m.HubComponent) },
      { path: 'experts', loadComponent: () => import('./landing/experts/experts.component').then(m => m.ExpertsComponent) },
      { path: 'events', loadComponent: () => import('./landing/events/events.component').then(m => m.EventsComponent) },
      { path: 'partners', loadComponent: () => import('./landing/partners/partners.component').then(m => m.PartnersComponent) },
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./dashboard/overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'roadmaps', loadComponent: () => import('./dashboard/roadmaps/roadmaps.component').then(m => m.RoadmapsComponent) },
      { path: 'calendar', loadComponent: () => import('./dashboard/calendar/calendar.component').then(m => m.CalendarComponent) },
      { path: 'tasks', loadComponent: () => import('./dashboard/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'personnel', loadComponent: () => import('./dashboard/personnel/personnel.component').then(m => m.PersonnelComponent) },
      { path: 'partners', loadComponent: () => import('./dashboard/partners/partners.component').then(m => m.PartnersComponent) },
      { path: 'events', loadComponent: () => import('./dashboard/events/events.component').then(m => m.EventsComponent) },
      { path: 'settings', loadComponent: () => import('./dashboard/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];
