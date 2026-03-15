import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="bg-ghg-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">Lĩnh Vực Hoạt Động</h1>
        <p class="mt-4 text-xl text-ghg-100">Cung cấp các giải pháp toàn diện hỗ trợ doanh nghiệp chuyển đổi xanh</p>
      </div>
    </div>

    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg prose-ghg mx-auto text-gray-600" [innerHTML]="dataService.pageContent().services">
        </div>
      </div>
    </div>
  `
})
export class ServicesComponent {
  dataService = inject(DataService);
}
