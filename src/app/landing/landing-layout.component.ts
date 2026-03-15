import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-white font-sans flex flex-col relative">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="flex items-center gap-2 group">
                <mat-icon class="text-ghg-500 text-3xl h-8 w-8 group-hover:scale-110 transition-transform">eco</mat-icon>
                <span class="text-2xl font-bold text-ghg-500 tracking-tight">{{ settings().siteName.substring(0, 3) }}<span class="text-white bg-ghg-500 px-1 rounded ml-0.5">{{ settings().siteName.substring(3) }}</span></span>
              </a>
            </div>
            
            <!-- Desktop Menu -->
            <nav class="hidden md:flex space-x-6 lg:space-x-8">
              <a routerLink="/" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Trang chủ</a>
              <a routerLink="/about" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Về chúng tôi</a>
              <a routerLink="/services" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Dịch vụ</a>
              <a routerLink="/hub" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">HUB</a>
              <a routerLink="/experts" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Chuyên gia</a>
              <a routerLink="/events" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Sự kiện</a>
              <a routerLink="/partners" routerLinkActive="text-ghg-500 border-b-2 border-ghg-500" class="text-gray-600 hover:text-ghg-500 px-1 py-2 text-sm font-medium transition-all hover:-translate-y-0.5">Đối tác</a>
            </nav>
            
            <div class="hidden md:flex items-center space-x-4">
              @if (currentUser()) {
                <a routerLink="/dashboard" class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-ghg-500 hover:bg-opacity-90 shadow-sm transition-all hover:shadow-md hover:scale-105">
                  <mat-icon class="mr-2 text-sm h-5 w-5">dashboard</mat-icon>
                  Dashboard
                </a>
              } @else {
                <a routerLink="/login" class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-ghg-500 hover:bg-opacity-90 shadow-sm transition-all hover:shadow-md hover:scale-105">
                  <mat-icon class="mr-2 text-sm h-5 w-5">login</mat-icon>
                  Đăng nhập
                </a>
              }
            </div>

            <!-- Mobile menu button -->
            <div class="flex items-center md:hidden">
              <button (click)="toggleMobileMenu()" type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ghg-500" aria-expanded="false">
                <span class="sr-only">Open main menu</span>
                <mat-icon>{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (isMobileMenuOpen()) {
          <div class="md:hidden bg-white border-t border-gray-200">
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" [routerLinkActiveOptions]="{exact: true}" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Trang chủ</a>
              <a routerLink="/about" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Về chúng tôi</a>
              <a routerLink="/services" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Dịch vụ</a>
              <a routerLink="/hub" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">HUB</a>
              <a routerLink="/experts" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Chuyên gia</a>
              <a routerLink="/events" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Sự kiện</a>
              <a routerLink="/partners" (click)="closeMobileMenu()" routerLinkActive="bg-ghg-50 text-ghg-500" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghg-500 hover:bg-ghg-50">Đối tác</a>
              <div class="mt-4 pt-4 border-t border-gray-200">
                @if (currentUser()) {
                  <a routerLink="/dashboard" (click)="closeMobileMenu()" class="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-ghg-500 hover:bg-opacity-90">
                    <mat-icon class="mr-2 text-sm h-5 w-5">dashboard</mat-icon>
                    Dashboard
                  </a>
                } @else {
                  <a routerLink="/login" (click)="closeMobileMenu()" class="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-ghg-500 hover:bg-opacity-90">
                    <mat-icon class="mr-2 text-sm h-5 w-5">login</mat-icon>
                    Đăng nhập
                  </a>
                }
              </div>
            </div>
          </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Back to top button -->
      @if (showBackToTop()) {
        <button (click)="scrollToTop()" class="fixed bottom-8 right-8 z-50 p-3 bg-ghg-500 text-white rounded-full shadow-lg hover:bg-ghg-600 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 animate-bounce">
          <mat-icon>arrow_upward</mat-icon>
        </button>
      }

      <!-- Footer -->
      <footer class="bg-gray-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div class="flex items-center gap-2 mb-6">
                <mat-icon class="text-ghg-500 text-3xl h-8 w-8">eco</mat-icon>
                <span class="text-2xl font-bold text-white tracking-tight">{{ settings().siteName.substring(0, 3) }}<span class="text-ghg-500">{{ settings().siteName.substring(3) }}</span></span>
              </div>
              <p class="text-gray-400 leading-relaxed mb-6">
                Giải pháp toàn diện vì một Việt Nam xanh. Mạng lưới đối tác khí nhà kính Việt Nam hỗ trợ doanh nghiệp hướng tới Net Zero 2050.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Liên kết nhanh</h3>
                <ul class="space-y-3">
                  <li><a routerLink="/about" class="text-gray-400 hover:text-ghg-400 transition-colors">Về chúng tôi</a></li>
                  <li><a routerLink="/services" class="text-gray-400 hover:text-ghg-400 transition-colors">Lĩnh vực hoạt động</a></li>
                  <li><a routerLink="/hub" class="text-gray-400 hover:text-ghg-400 transition-colors">GHG HUB</a></li>
                  <li><a routerLink="/experts" class="text-gray-400 hover:text-ghg-400 transition-colors">Đội ngũ chuyên gia</a></li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Cộng đồng</h3>
                <ul class="space-y-3">
                  <li><a routerLink="/events" class="text-gray-400 hover:text-ghg-400 transition-colors">Sự kiện & Đào tạo</a></li>
                  <li><a routerLink="/partners" class="text-gray-400 hover:text-ghg-400 transition-colors">Đối tác & Thành viên</a></li>
                </ul>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold mb-6 border-b border-gray-700 pb-2">Thông tin liên hệ</h3>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <mat-icon class="text-ghg-500 mr-3 mt-0.5">location_on</mat-icon>
                  <span class="text-gray-400">{{ settings().contactAddress }}</span>
                </li>
                <li class="flex items-center">
                  <mat-icon class="text-ghg-500 mr-3">phone</mat-icon>
                  <span class="text-gray-400">{{ settings().contactPhone }}</span>
                </li>
                <li class="flex items-center">
                  <mat-icon class="text-ghg-500 mr-3">email</mat-icon>
                  <span class="text-gray-400">{{ settings().contactEmail }}</span>
                </li>
                <li class="flex items-center">
                  <mat-icon class="text-ghg-500 mr-3">language</mat-icon>
                  <span class="text-gray-400">www.ghgvietnam.vn</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; 2024 {{ settings().siteName }} Partnership Network. All rights reserved.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-500 hover:text-white transition-colors"><mat-icon>facebook</mat-icon></a>
              <a href="#" class="text-gray-500 hover:text-white transition-colors"><mat-icon>ondemand_video</mat-icon></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingLayoutComponent {
  dataService = inject(DataService);
  settings = this.dataService.settings;
  currentUser = this.dataService.currentUser;
  
  isMobileMenuOpen = signal(false);
  showBackToTop = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop.set(window.pageYOffset > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
