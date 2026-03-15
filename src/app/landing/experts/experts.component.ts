import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-experts',
  standalone: true,
  template: `
    <div class="bg-ghg-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">Đội Ngũ Chuyên Gia</h1>
        <p class="mt-4 text-xl text-emerald-100">Những chuyên gia hàng đầu đồng hành cùng mạng lưới GHGVIETNAM</p>
      </div>
    </div>

    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg prose-ghg mx-auto text-gray-600" [innerHTML]="dataService.pageContent().experts">
        </div>
      </div>
    </div>
  `
})
export class ExpertsComponent {
  dataService = inject(DataService);
}
