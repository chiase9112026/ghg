import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DataService, Event } from '../../services/data.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  template: `
    <div class="bg-ghg-500 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">Sự kiện & Đào tạo</h1>
        <p class="mt-4 text-xl text-ghg-100">Tham gia các hoạt động nâng cao năng lực và kết nối cộng đồng</p>
      </div>
    </div>

    <div class="py-16 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (event of events(); track event.id) {
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
              <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                <img [src]="event.imageUrl || 'https://picsum.photos/seed/' + event.id + '/600/400'" [alt]="event.title" class="object-cover w-full h-full" referrerpolicy="no-referrer">
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <div class="flex items-center gap-2 mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ghg-100 text-ghg-800">
                    {{ event.type }}
                  </span>
                  <span class="text-sm text-gray-500">{{ event.date | date:'dd/MM/yyyy' }}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ event.title }}</h3>
                <p class="text-gray-600 mb-4 flex-1">{{ event.description }}</p>
                <div class="space-y-2 mb-6">
                  <div class="flex items-center text-sm text-gray-500">
                    <mat-icon class="text-gray-400 mr-2 text-sm">location_on</mat-icon>
                    {{ event.location }}
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <mat-icon class="text-gray-400 mr-2 text-sm">group</mat-icon>
                    {{ event.attendees }} người tham dự
                  </div>
                </div>
                <button 
                  (click)="openRegistrationModal(event)"
                  [disabled]="isEventPast(event.date)"
                  [class.opacity-50]="isEventPast(event.date)"
                  [class.cursor-not-allowed]="isEventPast(event.date)"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ghg-600 hover:bg-ghg-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 disabled:bg-gray-400 disabled:hover:bg-gray-400">
                  {{ isEventPast(event.date) ? 'Đã kết thúc' : 'Đăng ký ngay' }}
                </button>
              </div>
            </div>
          }
        </div>

        @if (events().length === 0) {
          <div class="text-center py-12">
            <mat-icon class="text-6xl text-gray-300 mb-4">event_busy</mat-icon>
            <h3 class="text-lg font-medium text-gray-900">Chưa có sự kiện nào</h3>
            <p class="mt-1 text-gray-500">Vui lòng quay lại sau để cập nhật các sự kiện mới nhất.</p>
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
                    Đăng ký tham gia: {{ selectedEvent()?.title }}
                  </h3>
                  <div class="mt-4">
                    <form class="space-y-4">
                      <div>
                        <label for="reg-name" class="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input id="reg-name" type="text" [(ngModel)]="registrationForm.name" name="name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                      </div>
                      <div>
                        <label for="reg-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input id="reg-email" type="email" [(ngModel)]="registrationForm.email" name="email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                      </div>
                      <div>
                        <label for="reg-phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input id="reg-phone" type="text" [(ngModel)]="registrationForm.phone" name="phone" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                      </div>
                      <div>
                        <label for="reg-org" class="block text-sm font-medium text-gray-700">Tổ chức / Công ty</label>
                        <input id="reg-org" type="text" [(ngModel)]="registrationForm.organization" name="organization" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 sm:text-sm">
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" (click)="submitRegistration()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ghg-600 text-base font-medium text-white hover:bg-ghg-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghg-500 sm:ml-3 sm:w-auto sm:text-sm">
                Xác nhận Đăng ký
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
        <span class="block sm:inline"> Đăng ký của bạn đã được ghi nhận.</span>
      </div>
    }
  `
})
export class EventsComponent {
  dataService = inject(DataService);
  events = this.dataService.events;

  isModalOpen = signal(false);
  selectedEvent = signal<Event | null>(null);
  showSuccessToast = signal(false);

  registrationForm = {
    name: '',
    email: '',
    phone: '',
    organization: ''
  };

  isEventPast(dateString: string): boolean {
    const eventDate = new Date(dateString);
    const now = new Date();
    return eventDate < now;
  }

  openRegistrationModal(event: Event) {
    if (this.isEventPast(event.date)) return;
    this.selectedEvent.set(event);
    this.registrationForm = { name: '', email: '', phone: '', organization: '' };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedEvent.set(null);
  }

  async submitRegistration() {
    const event = this.selectedEvent();
    if (event && this.registrationForm.name && this.registrationForm.email) {
      const newRegistration = {
        eventId: event.id,
        ...this.registrationForm,
        status: 'PENDING' as const,
        createdAt: new Date().toISOString()
      };
      
      await this.dataService.addData('eventRegistrations', newRegistration);
      
      this.closeModal();
      this.showSuccessToast.set(true);
      setTimeout(() => this.showSuccessToast.set(false), 3000);
    }
  }
}
