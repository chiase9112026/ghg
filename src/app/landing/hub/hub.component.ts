import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="bg-ghg-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">GHGVIETNAM HUB</h1>
        <p class="mt-4 text-xl text-emerald-100">Eco & Innovation Center - Ngôi nhà chung của cộng đồng xanh Việt Nam</p>
      </div>
    </div>

    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg prose-ghg mx-auto text-gray-600" [innerHTML]="dataService.pageContent().hub">
        </div>
      </div>
    </div>
  `
})
export class HubComponent {
  dataService = inject(DataService);
}
