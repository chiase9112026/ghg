import { Component, signal, inject, AfterViewInit, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';
import { animate, stagger } from "motion";

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  template: `
    <div class="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <!-- Mobile sidebar backdrop -->
      @if (isMobileMenuOpen()) {
        <div class="fixed inset-0 bg-gray-900/80 z-20 lg:hidden transition-opacity duration-300" (click)="toggleMobileMenu()" (keydown.enter)="toggleMobileMenu()" tabindex="0" role="button" aria-label="Close mobile menu"></div>
      }

      <!-- Sidebar -->
      <div class="fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-white shadow-xl flex flex-col sidebar-container"
           [class.-translate-x-full]="!isMobileMenuOpen()">
        <div class="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <a routerLink="/" class="flex items-center group">
            <mat-icon class="text-ghg-500 mr-2 group-hover:rotate-12 transition-transform">eco</mat-icon>
            <span class="text-xl font-bold text-ghg-500 tracking-tight">GHG HUB</span>
          </a>
          <button class="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors" (click)="toggleMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto nav-items">
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 px-4 mt-2">Chung</div>
          <a routerLink="/dashboard/overview" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">dashboard</mat-icon>
            <span class="font-medium">Tổng quan</span>
          </a>
          
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3 px-4">Quản lý Dự án</div>
          <a routerLink="/dashboard/roadmaps" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">map</mat-icon>
            <span class="font-medium">Lộ trình & Dự án</span>
          </a>
          <a routerLink="/dashboard/calendar" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">calendar_month</mat-icon>
            <span class="font-medium">Lịch Công Việc</span>
          </a>
          <a routerLink="/dashboard/tasks" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">assignment</mat-icon>
            <span class="font-medium">Công việc (Tasks)</span>
          </a>

          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3 px-4">Hệ sinh thái</div>
          <a routerLink="/dashboard/personnel" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">badge</mat-icon>
            <span class="font-medium">Nhân sự nội bộ</span>
          </a>
          <a routerLink="/dashboard/partners" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">handshake</mat-icon>
            <span class="font-medium">Mạng lưới Đối tác</span>
          </a>
          <a routerLink="/dashboard/events" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">event</mat-icon>
            <span class="font-medium">Sự kiện HUB</span>
          </a>

          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-8 mb-3 px-4">Hệ thống</div>
          <a routerLink="/dashboard/settings" routerLinkActive="bg-ghg-50 text-ghg-500 shadow-sm" (click)="closeMobileMenu()" class="nav-link flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">settings</mat-icon>
            <span class="font-medium">Cài đặt</span>
          </a>
        </nav>
        <div class="p-4 border-t border-gray-100 space-y-1">
          <a routerLink="/" class="w-full flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-gray-50 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-ghg-500 transition-colors">home</mat-icon>
            <span class="font-medium">Về trang chủ</span>
          </a>
          <button (click)="logout()" class="w-full flex items-center px-4 py-2.5 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all group">
            <mat-icon class="mr-3 text-gray-400 group-hover:text-red-500 transition-colors">logout</mat-icon>
            <span class="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden w-full">
        <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 z-10">
          <div class="flex items-center">
            <button class="lg:hidden text-gray-400 hover:text-gray-600 mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors" (click)="toggleMobileMenu()">
              <mat-icon>menu</mat-icon>
            </button>
            <div class="hidden sm:flex items-center bg-gray-50 rounded-full px-4 py-2 w-64 md:w-96 border border-gray-100 focus-within:border-ghg-300 focus-within:bg-white transition-all">
              <mat-icon class="text-gray-400 text-sm">search</mat-icon>
              <input type="text" placeholder="Tìm kiếm..." class="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none text-gray-600">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-400 hover:text-ghg-500 p-2 rounded-full hover:bg-ghg-50 transition-all relative group">
              <mat-icon>notifications</mat-icon>
              <span class="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white group-hover:scale-110 transition-transform"></span>
            </button>
            <div class="flex items-center space-x-3 pl-4 border-l border-gray-100">
              <div class="text-right hidden md:block">
                <p class="text-xs font-bold text-gray-900 leading-none mb-1">{{ currentUser()?.displayName || 'Admin' }}</p>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider leading-none">Thành viên</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-ghg-100 flex items-center justify-center text-ghg-500 font-bold border-2 border-white shadow-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                @if (currentUser()?.photoURL) {
                  <img [src]="currentUser()?.photoURL" referrerpolicy="no-referrer" alt="User avatar" class="w-full h-full object-cover">
                } @else {
                  {{ currentUser()?.displayName?.charAt(0) || 'A' }}
                }
              </div>
            </div>
          </div>
        </header>
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 sm:p-8 main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent implements AfterViewInit {
  dataService = inject(DataService);
  router = inject(Router);
  el = inject(ElementRef);
  currentUser = this.dataService.currentUser;
  isMobileMenuOpen = signal(false);

  ngAfterViewInit() {
    const navLinks = this.el.nativeElement.querySelectorAll('.nav-link');
    animate(
      navLinks,
      { opacity: [0, 1], x: [-20, 0] },
      { delay: stagger(0.05), duration: 0.5, ease: "easeOut" }
    );
  }

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
