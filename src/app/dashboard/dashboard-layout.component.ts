import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-100 font-sans">
      <!-- Mobile sidebar backdrop -->
      @if (isMobileMenuOpen()) {
        <div class="fixed inset-0 bg-gray-900/80 z-20 lg:hidden" (click)="toggleMobileMenu()" (keydown.enter)="toggleMobileMenu()" tabindex="0" role="button" aria-label="Close mobile menu"></div>
      }

      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white shadow-md flex flex-col"
           [class.-translate-x-full]="!isMobileMenuOpen()">
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <a routerLink="/" class="flex items-center">
            <mat-icon class="text-ghg-500 mr-2">eco</mat-icon>
            <span class="text-xl font-bold text-ghg-500">GHG HUB</span>
          </a>
          <button class="lg:hidden text-gray-500 hover:text-gray-700" (click)="toggleMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Chung</div>
          <a routerLink="/dashboard/overview" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">dashboard</mat-icon>
            <span class="font-medium">Tổng quan</span>
          </a>
          
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-4">Quản lý Dự án</div>
          <a routerLink="/dashboard/roadmaps" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">map</mat-icon>
            <span class="font-medium">Lộ trình & Dự án</span>
          </a>
          <a routerLink="/dashboard/calendar" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">calendar_month</mat-icon>
            <span class="font-medium">Lịch Công Việc</span>
          </a>
          <a routerLink="/dashboard/tasks" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">assignment</mat-icon>
            <span class="font-medium">Công việc (Tasks)</span>
          </a>

          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-4">Hệ sinh thái</div>
          <a routerLink="/dashboard/personnel" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">badge</mat-icon>
            <span class="font-medium">Nhân sự nội bộ</span>
          </a>
          <a routerLink="/dashboard/partners" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">handshake</mat-icon>
            <span class="font-medium">Mạng lưới Đối tác</span>
          </a>
          <a routerLink="/dashboard/events" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">event</mat-icon>
            <span class="font-medium">Sự kiện HUB</span>
          </a>

          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-4">Hệ thống</div>
          <a routerLink="/dashboard/settings" routerLinkActive="bg-ghg-50 text-ghg-500" (click)="closeMobileMenu()" class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">settings</mat-icon>
            <span class="font-medium">Cài đặt</span>
          </a>
        </nav>
        <div class="p-4 border-t border-gray-200 space-y-2">
          <a routerLink="/" class="w-full flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <mat-icon class="mr-3 text-gray-500">home</mat-icon>
            <span class="font-medium">Về trang chủ</span>
          </a>
          <button (click)="logout()" class="w-full flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors">
            <mat-icon class="mr-3 text-gray-500">logout</mat-icon>
            <span class="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden w-full">
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-8 z-10">
          <div class="flex items-center">
            <button class="lg:hidden text-gray-500 hover:text-gray-700 mr-4" (click)="toggleMobileMenu()">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 w-64 md:w-96">
              <mat-icon class="text-gray-400 text-sm">search</mat-icon>
              <input type="text" placeholder="Tìm kiếm..." class="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-400 hover:text-gray-600 relative">
              <mat-icon>notifications</mat-icon>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div class="flex items-center space-x-3">
              <span class="hidden md:block text-sm font-medium text-gray-700">{{ currentUser()?.displayName || 'Admin' }}</span>
              <div class="w-8 h-8 rounded-full bg-ghg-100 flex items-center justify-center text-ghg-500 font-bold border border-ghg-200 overflow-hidden">
                @if (currentUser()?.photoURL) {
                  <img [src]="currentUser()?.photoURL" referrerpolicy="no-referrer" alt="User avatar" class="w-full h-full object-cover">
                } @else {
                  {{ currentUser()?.displayName?.charAt(0) || 'A' }}
                }
              </div>
            </div>
          </div>
        </header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  dataService = inject(DataService);
  router = inject(Router);
  currentUser = this.dataService.currentUser;
  isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  async logout() {
    await this.dataService.logout();
    this.router.navigate(['/']);
  }
}
