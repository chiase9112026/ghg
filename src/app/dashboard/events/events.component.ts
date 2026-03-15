import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Event } from '../../services/data.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Sự kiện</h1>
        <button (click)="openModal()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">event</mat-icon> Tạo Sự kiện
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button (click)="activeTab.set('LIST')"
            [class.border-ghg-500]="activeTab() === 'LIST'"
            [class.text-ghg-600]="activeTab() === 'LIST'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Danh sách Sự kiện
          </button>
          <button (click)="activeTab.set('REGISTRATIONS')"
            [class.border-ghg-500]="activeTab() === 'REGISTRATIONS'"
            [class.text-ghg-600]="activeTab() === 'REGISTRATIONS'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 relative">
            Danh sách Đăng ký
            @if (pendingRegistrationsCount() > 0) {
              <span class="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ pendingRegistrationsCount() }}</span>
            }
          </button>
        </nav>
      </div>

      @if (activeTab() === 'LIST') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (event of events(); track event.id) {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative group">
              <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 z-10">
                <button (click)="editEvent(event)" class="text-white bg-indigo-600 hover:bg-indigo-700 p-1.5 rounded-md shadow-sm"><mat-icon class="text-sm">edit</mat-icon></button>
                <button (click)="deleteEvent(event.id)" class="text-white bg-red-600 hover:bg-red-700 p-1.5 rounded-md shadow-sm"><mat-icon class="text-sm">delete</mat-icon></button>
              </div>
              
              <div class="h-40 bg-gray-200 relative overflow-hidden">
                <img [src]="event.imageUrl || 'https://picsum.photos/seed/' + event.id + '/600/400'" alt="Event cover" class="w-full h-full object-cover" referrerpolicy="no-referrer">
                <div class="absolute top-4 left-4">
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm"
                    [ngClass]="{
                      'bg-blue-100 text-blue-800': event.type === 'TALKSHOW',
                      'bg-ghg-100 text-ghg-800': event.type === 'WORKSHOP',
                      'bg-purple-100 text-purple-800': event.type === 'MATCHING',
                      'bg-orange-100 text-orange-800': event.type === 'TRAINING'
                    }">
                    {{ event.type }}
                  </span>
                </div>
              </div>
              <div class="p-6 flex-1 flex flex-col">
                <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{{ event.title }}</h3>
                <p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{{ event.description }}</p>
                
                <div class="space-y-2 mb-6">
                  <div class="flex items-center text-sm text-gray-600">
                    <mat-icon class="text-gray-400 mr-2 text-sm">calendar_today</mat-icon>
                    {{ event.date }}
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <mat-icon class="text-gray-400 mr-2 text-sm">location_on</mat-icon>
                    {{ event.location }}
                  </div>
                </div>
                
                <div class="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <div class="flex items-center text-sm text-gray-500">
                    <mat-icon class="text-gray-400 mr-1 text-sm">group</mat-icon>
                    {{ event.attendees || 0 }} người
                  </div>
                  <button class="text-ghg-600 hover:text-ghg-800 text-sm font-medium">Chi tiết</button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người đăng ký</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sự kiện</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổ chức</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (reg of eventRegistrations(); track reg.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ reg.name }}</div>
                    <div class="text-xs text-gray-500">{{ reg.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getEventTitle(reg.eventId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ reg.organization }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [class.bg-yellow-100]="reg.status === 'PENDING'"
                      [class.text-yellow-800]="reg.status === 'PENDING'"
                      [class.bg-green-100]="reg.status === 'APPROVED'"
                      [class.text-green-800]="reg.status === 'APPROVED'"
                      [class.bg-red-100]="reg.status === 'REJECTED'"
                      [class.text-red-800]="reg.status === 'REJECTED'">
                      {{ reg.status === 'PENDING' ? 'Chờ duyệt' : (reg.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    @if (reg.status === 'PENDING') {
                      <div class="flex justify-end gap-2">
                        <button (click)="approveRequest(reg.id)" class="text-ghg-600 hover:text-ghg-900"><mat-icon>check_circle</mat-icon></button>
                        <button (click)="rejectRequest(reg.id)" class="text-red-600 hover:text-red-900"><mat-icon>cancel</mat-icon></button>
                      </div>
                    } @else {
                      <button (click)="deleteRequest(reg.id)" class="text-gray-400 hover:text-red-600"><mat-icon>delete</mat-icon></button>
                    }
                  </td>
                </tr>
              }
              @if (eventRegistrations().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    Không có đăng ký sự kiện nào.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <!-- Modal Form -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-gray-900">{{ editingId() ? 'Sửa Sự kiện' : 'Tạo Sự kiện mới' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form (ngSubmit)="saveEvent()" class="space-y-4">
            <div>
              <label for="eventTitle" class="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện</label>
              <input id="eventTitle" type="text" [(ngModel)]="formData.title" name="title" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div>
              <label for="eventType" class="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
              <select id="eventType" [(ngModel)]="formData.type" name="type" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                <option value="TALKSHOW">Talkshow</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="MATCHING">Business Matching</option>
                <option value="TRAINING">Đào tạo</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="eventDate" class="block text-sm font-medium text-gray-700 mb-1">Ngày giờ</label>
                <input id="eventDate" type="text" placeholder="VD: 2024-05-20 09:00" [(ngModel)]="formData.date" name="date" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="eventLocation" class="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                <input id="eventLocation" type="text" [(ngModel)]="formData.location" name="location" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div>
              <label for="eventDesc" class="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea id="eventDesc" [(ngModel)]="formData.description" name="description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500"></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="eventAttendees" class="block text-sm font-medium text-gray-700 mb-1">Số lượng tham dự</label>
                <input id="eventAttendees" type="number" [(ngModel)]="formData.attendees" name="attendees"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="eventImageUrl" class="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                <input id="eventImageUrl" type="text" [(ngModel)]="formData.imageUrl" name="imageUrl" placeholder="https://..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" (click)="closeModal()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Hủy
              </button>
              <button type="submit" class="px-4 py-2 bg-ghg-600 text-white rounded-md text-sm font-medium hover:bg-ghg-700">
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    }
    <!-- Delete Confirmation Modal -->
    @if (isDeleteModalOpen()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <mat-icon class="text-red-600">warning</mat-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.</p>
          <div class="flex justify-center space-x-3">
            <button (click)="closeDeleteModal()" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Hủy
            </button>
            <button (click)="confirmDelete()" class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
              Xóa
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class EventsComponent {
  dataService = inject(DataService);
  events = this.dataService.events;
  eventRegistrations = this.dataService.eventRegistrations;

  activeTab = signal<'LIST' | 'REGISTRATIONS'>('LIST');
  pendingRegistrationsCount = computed(() => {
    return this.dataService.eventRegistrations().filter(r => r.status === 'PENDING').length;
  });

  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  formData: Partial<Event> = {};

  openModal() {
    this.editingId.set(null);
    this.formData = {
      title: '',
      type: 'WORKSHOP',
      date: '',
      location: ''
    };
    this.isModalOpen.set(true);
  }

  editEvent(event: Event) {
    this.editingId.set(event.id);
    this.formData = { ...event };
    this.isModalOpen.set(true);
  }

  deleteEvent(id: string) {
    this.deletingId.set(id);
    this.isDeleteModalOpen.set(true);
  }

  async confirmDelete() {
    const id = this.deletingId();
    if (id) {
      await this.dataService.deleteData('events', id);
    }
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.deletingId.set(null);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  async saveEvent() {
    if (this.editingId()) {
      const id = this.editingId()!;
      await this.dataService.updateData('events', id, this.formData);
    } else {
      await this.dataService.addData('events', this.formData);
    }
    this.closeModal();
  }

  getEventTitle(eventId: string): string {
    const event = this.dataService.events().find(e => e.id === eventId);
    return event ? event.title : 'Sự kiện không xác định';
  }

  async approveRequest(id: string) {
    await this.dataService.updateData('eventRegistrations', id, { status: 'APPROVED' });
  }

  async rejectRequest(id: string) {
    await this.dataService.updateData('eventRegistrations', id, { status: 'REJECTED' });
  }

  async deleteRequest(id: string) {
    await this.dataService.deleteData('eventRegistrations', id);
  }
}
