import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Settings, PageContent } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Cài đặt Hệ thống</h1>
        <button (click)="saveSettings()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">save</mat-icon> Lưu thay đổi
        </button>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <mat-icon class="mr-2 text-ghg-500">web</mat-icon>
            Thông tin Website (Landing Page)
          </h2>
          <p class="text-sm text-gray-500 mt-1">Cập nhật các thông tin hiển thị trên trang chủ công khai.</p>
        </div>
        
        <div class="p-6">
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="siteName" class="block text-sm font-medium text-gray-700 mb-1">Tên Website</label>
                <input id="siteName" type="text" [(ngModel)]="formData.siteName" name="siteName"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent">
              </div>
              
              <div>
                <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Liên hệ</label>
                <input id="contactEmail" type="email" [(ngModel)]="formData.contactEmail" name="contactEmail"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent">
              </div>
              
              <div>
                <label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại Liên hệ</label>
                <input id="contactPhone" type="text" [(ngModel)]="formData.contactPhone" name="contactPhone"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent">
              </div>
              
              <div>
                <label for="contactAddress" class="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input id="contactAddress" type="text" [(ngModel)]="formData.contactAddress" name="contactAddress"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent">
              </div>
            </div>

            <div class="border-t border-gray-100 pt-6">
              <h3 class="text-md font-bold text-gray-900 mb-4">Nội dung Hero Banner</h3>
              
              <div class="space-y-4">
                <div>
                  <label for="heroTitle" class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề chính (Hero Title)</label>
                  <input id="heroTitle" type="text" [(ngModel)]="formData.heroTitle" name="heroTitle"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent">
                </div>
                
                <div>
                  <label for="heroSubtitle" class="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn (Hero Subtitle)</label>
                  <textarea id="heroSubtitle" [(ngModel)]="formData.heroSubtitle" name="heroSubtitle" rows="3"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent"></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <mat-icon class="mr-2 text-ghg-500">article</mat-icon>
            Nội dung các trang
          </h2>
          <p class="text-sm text-gray-500 mt-1">Chỉnh sửa nội dung cho các trang giới thiệu.</p>
        </div>
        
        <div class="p-6">
          <form class="space-y-6">
            <div>
              <label for="pageAbout" class="block text-sm font-medium text-gray-700 mb-1">Trang Giới thiệu (/about)</label>
              <textarea id="pageAbout" [(ngModel)]="pageContentData.about" name="about" rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent"></textarea>
            </div>
            <div>
              <label for="pageServices" class="block text-sm font-medium text-gray-700 mb-1">Trang Dịch vụ (/services)</label>
              <textarea id="pageServices" [(ngModel)]="pageContentData.services" name="services" rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent"></textarea>
            </div>
            <div>
              <label for="pageHub" class="block text-sm font-medium text-gray-700 mb-1">Trang Hub (/hub)</label>
              <textarea id="pageHub" [(ngModel)]="pageContentData.hub" name="hub" rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent"></textarea>
            </div>
            <div>
              <label for="pageExperts" class="block text-sm font-medium text-gray-700 mb-1">Trang Chuyên gia (/experts)</label>
              <textarea id="pageExperts" [(ngModel)]="pageContentData.experts" name="experts" rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ghg-500 focus:border-transparent"></textarea>
            </div>
          </form>
        </div>
      </div>
      
      @if (showSuccessMessage) {
        <div class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-md" role="alert">
          <strong class="font-bold">Thành công!</strong>
          <span class="block sm:inline"> Cài đặt đã được lưu.</span>
        </div>
      }
    </div>
  `
})
export class SettingsComponent {
  dataService = inject(DataService);
  
  formData: Settings;
  pageContentData: PageContent;
  showSuccessMessage = false;

  constructor() {
    // Initialize form data with current settings
    this.formData = { ...this.dataService.settings() };
    this.pageContentData = { ...this.dataService.pageContent() };
  }

  async saveSettings() {
    await this.dataService.setData('settings', 'global', this.formData);
    await this.dataService.setData('pageContent', 'global', this.pageContentData);
    
    // Show success message briefly
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
