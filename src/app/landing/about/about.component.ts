import { Component, inject, AfterViewInit, ElementRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../services/data.service';
import { animate, stagger } from "motion";

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <!-- Page Header -->
    <div class="bg-ghg-500 py-16 animate-section">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl animate-item">Về Chúng Tôi</h1>
        <p class="mt-4 text-xl text-ghg-100 animate-item">Tìm hiểu về sứ mệnh, tầm nhìn và giá trị cốt lõi của GHGVIETNAM</p>
      </div>
    </div>

    <!-- Thư ngỏ -->
    <div class="py-16 bg-white animate-section">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg prose-ghg mx-auto text-gray-600 animate-item" [innerHTML]="dataService.pageContent().about">
        </div>
      </div>
    </div>

    <!-- Sứ mệnh & Tầm nhìn -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-ghg-50 rounded-full opacity-50"></div>
            <mat-icon class="text-5xl text-ghg-500 mb-6 relative z-10">flag</mat-icon>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 relative z-10">Sứ Mệnh</h3>
            <p class="text-gray-600 text-lg leading-relaxed relative z-10">
              Kiến tạo và đại diện cho các tổ chức kinh doanh và khối doanh nghiệp ở Việt Nam trong quá trình hành động giảm phát thải nhà kính, chuyển đổi xanh và hướng đến nền kinh tế tuần hoàn và các-bon thấp.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
            <mat-icon class="text-5xl text-blue-500 mb-6 relative z-10">visibility</mat-icon>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 relative z-10">Tầm Nhìn</h3>
            <p class="text-gray-600 text-lg leading-relaxed relative z-10">
              Đến năm 2030, mạng lưới đối tác GHGVietnam sẽ trở thành Hiệp hội quy tụ các đối tác hàng đầu để hỗ trợ, thúc đẩy khối doanh nghiệp hành động giảm phát thải khí nhà kính, chuyển đổi xanh và hướng đến kinh tế tuần hoàn và các-bon thấp.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Giá trị cốt lõi -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-extrabold text-gray-900">Giá Trị Cốt Lõi</h2>
        </div>
        <div class="space-y-8">
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-shrink-0 w-16 h-16 bg-ghg-100 rounded-full flex items-center justify-center text-ghg-500 font-bold text-xl">1</div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Tuân thủ và phù hợp</h4>
              <p class="text-gray-600">Luôn hành động theo chủ trương, chính sách của Đảng và Nhà nước về đổi mới mô hình tăng trưởng của Việt Nam theo hướng phát triển kinh tế xanh, kinh tế tuần hoàn, kinh tế các-bon thấp.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-shrink-0 w-16 h-16 bg-ghg-100 rounded-full flex items-center justify-center text-ghg-500 font-bold text-xl">2</div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Tôn trọng và hài hoà lợi ích</h4>
              <p class="text-gray-600">Tôn trọng ý kiến và tôn chỉ hoạt động của các đối tác. Hành động dựa trên nguyên tắc các bên tham gia cùng có lợi, cùng thắng. Nếu có rủi ro sẽ cùng nhau chia sẻ và cùng nhau hợp tác để giảm thiểu rủi ro xuống mức thấp nhất.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-shrink-0 w-16 h-16 bg-ghg-100 rounded-full flex items-center justify-center text-ghg-500 font-bold text-xl">3</div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Cam kết chất lượng và giá trị</h4>
              <p class="text-gray-600">Tạo ra các nền tảng về đào tạo, tư vấn kiểm kê khí nhà kính và ứng dụng khoa học công nghệ giảm phát thải khí nhà kính hướng đến chuyển đổi xanh, kinh tế tuần hoàn, kinh tế các-bon thấp cho các doanh nghiệp trong và ngoài nước ngoài đầu tư tại Việt Nam.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-shrink-0 w-16 h-16 bg-ghg-100 rounded-full flex items-center justify-center text-ghg-500 font-bold text-xl">4</div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Đổi mới sáng tạo và số hoá</h4>
              <p class="text-gray-600">Tạo ra các giá trị thực tiễn dựa trên tư duy đổi mới sáng tạo, ứng dụng các thành tựu khoa học công nghệ hiện đại. Đồng thời số hoá các nội dung kỹ thuật để có thể truyền tải nhanh, chính xác và lan toả sâu rộng.</p>
            </div>
          </div>
          <div class="flex flex-col md:flex-row gap-6 items-start">
            <div class="flex-shrink-0 w-16 h-16 bg-ghg-100 rounded-full flex items-center justify-center text-ghg-500 font-bold text-xl">5</div>
            <div>
              <h4 class="text-xl font-bold text-gray-900 mb-2">Tăng trưởng bền vững</h4>
              <p class="text-gray-600">Hợp tác và hành động có trách nhiệm, vì lợi ích của các thành viên của mạng lưới, của khối doanh nghiệp và của cộng đồng. Hướng đến phục vụ các mục tiêu về net-zero, tăng trưởng xanh và phát triển bền vững của Việt Nam.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent implements AfterViewInit {
  dataService = inject(DataService);
  el = inject(ElementRef);

  ngAfterViewInit() {
    const items = this.el.nativeElement.querySelectorAll('.animate-item');
    animate(
      items,
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.1), duration: 0.8, ease: "easeOut" }
    );
  }
}
