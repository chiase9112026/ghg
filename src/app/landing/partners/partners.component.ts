import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="bg-ghg-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">Đối tác & Thành viên</h1>
        <p class="mt-4 text-xl text-ghg-50">Mạng lưới các tổ chức cùng chung tay vì một Việt Nam xanh</p>
        <button (click)="openModal()" class="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-ghg-600 bg-white hover:bg-ghg-50 shadow-sm transition-colors">
          <mat-icon class="mr-2">handshake</mat-icon> Đăng ký làm đối tác
        </button>
      </div>
    </div>

    <div class="py-16 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (partner of partners(); track partner.id) {
            <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 flex flex-col items-center text-center">
              <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4 overflow-hidden border border-gray-200">
                @if (partner.logoUrl) {
                  <img [src]="partner.logoUrl" [alt]="partner.name" class="w-full h-full object-cover" referrerpolicy="no-referrer">
                } @else {
                  <mat-icon class="text-gray-400 text-4xl">business</mat-icon>
                }
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">{{ partner.name }}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ghg-50 text-ghg-500 mb-3">
                {{ partner.type }}
              </span>
              <p class="text-sm text-gray-500 mb-4 flex-1">{{ partner.industry }}</p>
              
              <div class="w-full pt-4 border-t border-gray-100 flex justify-center gap-4">
                @if (partner.website) {
                  <a [href]="partner.website" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-ghg-500 transition-colors" title="Website">
                    <mat-icon class="text-xl">language</mat-icon>
                  </a>
                }
                @if (partner.contactEmail) {
                  <a [href]="'mailto:' + partner.contactEmail" class="text-gray-400 hover:text-ghg-500 transition-colors" title="Email">
                    <mat-icon class="text-xl">email</mat-icon>
                  </a>
                }
              </div>
            </div>
          }
        </div>

        @if (partners().length === 0) {
          <div class="text-center py-12">
            <mat-icon class="text-6xl text-gray-300 mb-4">group_off</mat-icon>
            <h3 class="text-lg font-medium text-gray-900">Chưa có đối tác nào</h3>
            <p class="mt-1 text-gray-500">Danh sách đối tác sẽ được cập nhật sớm nhất.</p>
          </div>
        }
      </div>
    </div>

    <!-- Registration Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Đăng ký trở thành Đối tác
                  </h3>
                  <div class="mt-4">
                    <form #regForm="ngForm" class="space-y-4">
                      <div>
                        <label for="p-name" class="block text-sm font-medium text-gray-700">Họ và tên người đại diện</label>
                        <input id="p-name" type="text" [(ngModel)]="formData.name" name="name" required #name="ngModel"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                        @if (name.invalid && name.touched) {
                          <p class="text-red-500 text-xs mt-1">Vui lòng nhập họ tên</p>
                        }
                      </div>
                      <div>
                        <label for="p-email" class="block text-sm font-medium text-gray-700">Email liên hệ</label>
                        <input id="p-email" type="email" [(ngModel)]="formData.email" name="email" required email #email="ngModel"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                        @if (email.invalid && email.touched) {
                          <p class="text-red-500 text-xs mt-1">Vui lòng nhập email hợp lệ</p>
                        }
                      </div>
                      <div>
                        <label for="p-company" class="block text-sm font-medium text-gray-700">Tên Công ty / Tổ chức</label>
                        <input id="p-company" type="text" [(ngModel)]="formData.company" name="company" required #company="ngModel"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                        @if (company.invalid && company.touched) {
                          <p class="text-red-500 text-xs mt-1">Vui lòng nhập tên công ty</p>
                        }
                      </div>
                      <div>
                        <label for="p-phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input id="p-phone" type="text" [(ngModel)]="formData.phone" name="phone" required pattern="[0-9]{10,11}" #phone="ngModel"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                        @if (phone.invalid && phone.touched) {
                          <p class="text-red-500 text-xs mt-1">Vui lòng nhập số điện thoại hợp lệ (10-11 số)</p>
                        }
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="p-type" class="block text-sm font-medium text-gray-700">Loại hình</label>
                          <select id="p-type" [(ngModel)]="formData.type" name="type" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                            <option value="ENTERPRISE">Doanh nghiệp</option>
                            <option value="STARTUP">Startup</option>
                            <option value="INVESTOR">Nhà đầu tư</option>
                            <option value="NGO">Tổ chức phi lợi nhuận</option>
                          </select>
                        </div>
                        <div>
                          <label for="p-industry" class="block text-sm font-medium text-gray-700">Lĩnh vực</label>
                          <input id="p-industry" type="text" [(ngModel)]="formData.industry" name="industry" required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" (click)="submitRegistration(regForm.valid)" [disabled]="!regForm.valid"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ghg-600 text-base font-medium text-white hover:bg-ghg-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400">
                Gửi Đăng ký
              </button>
              <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Success Toast -->
    @if (showSuccessToast()) {
      <div class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-md z-50" role="alert">
        <strong class="font-bold">Thành công!</strong>
        <span class="block sm:inline"> Đăng ký đối tác của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm.</span>
      </div>
    }
  `
})
export class PartnersComponent {
  dataService = inject(DataService);
  partners = this.dataService.partners;

  isModalOpen = signal(false);
  showSuccessToast = signal(false);
  formData = {
    name: '',
    email: '',
    company: '',
    phone: '',
    type: 'ENTERPRISE' as const,
    industry: ''
  };

  openModal() {
    this.formData = {
      name: '',
      email: '',
      company: '',
      phone: '',
      type: 'ENTERPRISE',
      industry: ''
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async submitRegistration(isValid: boolean | null) {
    if (!isValid) return;

    const registration = {
      ...this.formData,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString()
    };

    await this.dataService.addData('partnerRegistrations', registration);
    
    this.closeModal();
    this.showSuccessToast.set(true);
    setTimeout(() => this.showSuccessToast.set(false), 3000);
  }
}
