import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatIconModule, DatePipe],
  template: `
    <!-- Hero Banner -->
    <div class="relative bg-ghg-500 overflow-hidden">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover opacity-40" src="https://picsum.photos/seed/forest/1920/1080" alt="Forest background" referrerpolicy="no-referrer">
        <div class="absolute inset-0 bg-gradient-to-r from-ghg-500 to-transparent mix-blend-multiply" aria-hidden="true"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <span class="inline-block py-1 px-3 rounded-full bg-ghg-500 bg-opacity-50 text-white text-sm font-semibold tracking-wider mb-6 border border-white/30">
            COMPREHENSIVE SOLUTIONS FOR A GREEN VIETNAM
          </span>
          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
            {{ settings().heroTitle }}
          </h1>
          <p class="mt-4 text-xl text-ghg-50 leading-relaxed font-light">
            {{ settings().heroSubtitle }}
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            <a routerLink="/about" class="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-medium rounded-full shadow-sm text-ghg-500 bg-white hover:bg-gray-50 transition-colors">
              Tìm hiểu thêm
            </a>
            <a routerLink="/hub" class="inline-flex items-center justify-center px-8 py-3.5 border border-white/50 text-base font-medium rounded-full shadow-sm text-white hover:bg-white/10 transition-colors">
              Khám phá GHG HUB
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white py-12 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <div class="text-4xl font-extrabold text-ghg-500">300+</div>
            <div class="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Thành viên</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-ghg-500">36</div>
            <div class="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Cơ sở giáo dục</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-ghg-500">35</div>
            <div class="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Tổ chức xã hội</div>
          </div>
          <div>
            <div class="text-4xl font-extrabold text-ghg-500">1000+</div>
            <div class="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wide">Mục tiêu 2025</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Introduction Section -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              Đồng hành cùng doanh nghiệp hướng tới Net Zero
            </h2>
            <p class="text-lg text-gray-600 mb-6 leading-relaxed">
              Mạng lưới đối tác khí nhà kính Việt Nam (GHGVIETNAM) là một sáng kiến của các tổ chức có cam kết hỗ trợ khối doanh nghiệp trong việc kiểm kê khí nhà kính, ứng dụng bộ tiêu chí môi trường, xã hội và quản trị (ESG).
            </p>
            <p class="text-lg text-gray-600 mb-8 leading-relaxed">
              Chúng tôi đi đầu trong việc tạo ra các nền tảng về đào tạo, tư vấn kiểm kê khí nhà kính, ứng dụng công nghệ, giải pháp giảm phát thải hướng đến các mục tiêu phát triển bền vững của Liên hợp quốc (SDGs).
            </p>
            <a routerLink="/about" class="text-ghg-500 font-semibold hover:text-ghg-500 hover:opacity-80 flex items-center">
              Đọc toàn bộ Thư ngỏ <mat-icon class="ml-1 text-sm">arrow_forward</mat-icon>
            </a>
          </div>
          <div class="mt-10 lg:mt-0 relative">
            <div class="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-xl">
              <img src="https://picsum.photos/seed/sustainability/800/600" alt="Sustainability" class="object-cover" referrerpolicy="no-referrer">
            </div>
            <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-ghg-50 rounded-full flex items-center justify-center text-ghg-500">
                  <mat-icon>verified</mat-icon>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Thành lập</div>
                  <div class="font-bold text-gray-900">12/04/2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Areas -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Lĩnh vực hoạt động chính</h2>
          <p class="mt-4 text-xl text-gray-500">Hệ sinh thái dịch vụ toàn diện hỗ trợ chuyển đổi xanh</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 rounded-2xl p-8 hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-ghg-50 rounded-xl flex items-center justify-center text-ghg-500 mb-6">
              <mat-icon class="text-3xl">school</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Đào tạo & Nâng cao năng lực</h3>
            <p class="text-gray-600 mb-4">Đào tạo chuyên gia kiểm kê KNK, giảng viên TOT, và đào tạo doanh nghiệp về ESG, tiêu chuẩn carbon.</p>
            <a routerLink="/services" class="text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80 text-sm flex items-center">Chi tiết <mat-icon class="ml-1 text-sm">chevron_right</mat-icon></a>
          </div>
          
          <div class="bg-gray-50 rounded-2xl p-8 hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <mat-icon class="text-3xl">support_agent</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Tư vấn & Thẩm định</h3>
            <p class="text-gray-600 mb-4">Tư vấn kiểm kê KNK, lập báo cáo ESG, đồng hành cùng doanh nghiệp xuất khẩu đáp ứng tiêu chuẩn quốc tế.</p>
            <a routerLink="/services" class="text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80 text-sm flex items-center">Chi tiết <mat-icon class="ml-1 text-sm">chevron_right</mat-icon></a>
          </div>
          
          <div class="bg-gray-50 rounded-2xl p-8 hover:shadow-md transition-shadow border border-gray-100">
            <div class="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
              <mat-icon class="text-3xl">science</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Phát triển Công nghệ</h3>
            <p class="text-gray-600 mb-4">Ứng dụng kỹ thuật tiên tiến về giảm phát thải, tiết kiệm năng lượng, quan trắc và giám sát phát thải.</p>
            <a routerLink="/services" class="text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80 text-sm flex items-center">Chi tiết <mat-icon class="ml-1 text-sm">chevron_right</mat-icon></a>
          </div>
        </div>
        <div class="text-center mt-10">
          <a routerLink="/services" class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Xem tất cả lĩnh vực
          </a>
        </div>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Sự kiện sắp tới</h2>
            <p class="mt-4 text-xl text-gray-500">Tham gia các hoạt động cộng đồng và đào tạo của chúng tôi</p>
          </div>
          <a routerLink="/events" class="hidden sm:inline-flex items-center text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80">
            Xem tất cả sự kiện <mat-icon class="ml-1 text-sm">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @for (event of recentEvents(); track event.id) {
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
              <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                <img [src]="event.imageUrl || 'https://picsum.photos/seed/' + event.id + '/600/400'" [alt]="event.title" class="object-cover w-full h-full" referrerpolicy="no-referrer">
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ghg-50 text-ghg-500">
                    {{ event.type }}
                  </span>
                  <span class="text-sm text-gray-500">{{ event.date | date:'dd/MM/yyyy' }}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{{ event.title }}</h3>
                <p class="text-gray-600 mb-4 line-clamp-3 flex-1">{{ event.description }}</p>
                <div class="flex items-center text-sm text-gray-500 mb-4">
                  <mat-icon class="text-gray-400 mr-1.5 text-sm">location_on</mat-icon>
                  {{ event.location }}
                </div>
                <a routerLink="/events" class="text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80 text-sm flex items-center mt-auto">
                  Đăng ký tham gia <mat-icon class="ml-1 text-sm">chevron_right</mat-icon>
                </a>
              </div>
            </div>
          }
        </div>
        <div class="mt-8 text-center sm:hidden">
          <a routerLink="/events" class="inline-flex items-center text-ghg-500 font-medium hover:text-ghg-500 hover:opacity-80">
            Xem tất cả sự kiện <mat-icon class="ml-1 text-sm">arrow_forward</mat-icon>
          </a>
        </div>
      </div>
    </div>

    <!-- Partners -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Đối tác & Thành viên</h2>
          <p class="mt-4 text-xl text-gray-500">Cùng nhau xây dựng hệ sinh thái phát triển bền vững</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
          @for (partner of featuredPartners(); track partner.id) {
            <div class="flex flex-col items-center text-center p-4 hover:opacity-100 transition-opacity cursor-pointer">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 overflow-hidden border border-gray-200">
                @if (partner.logoUrl) {
                  <img [src]="partner.logoUrl" [alt]="partner.name" class="w-full h-full object-cover" referrerpolicy="no-referrer">
                } @else {
                  <mat-icon class="text-gray-400 text-3xl">business</mat-icon>
                }
              </div>
              <span class="text-sm font-medium text-gray-900">{{ partner.name }}</span>
              <span class="text-xs text-gray-500">{{ partner.type }}</span>
            </div>
          }
        </div>
        
        <div class="text-center mt-12">
          <a routerLink="/partners" class="inline-flex items-center px-6 py-3 border border-ghg-500 shadow-sm text-base font-medium rounded-full text-ghg-500 bg-white hover:bg-ghg-50 transition-colors">
            Trở thành đối tác
          </a>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  dataService = inject(DataService);
  settings = this.dataService.settings;
  
  // Get up to 3 upcoming events
  recentEvents = () => {
    return this.dataService.events().slice(0, 3);
  };

  // Get up to 10 partners
  featuredPartners = () => {
    return this.dataService.partners().slice(0, 10);
  };
}
