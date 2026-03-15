import { Component, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Tổng quan Hệ sinh thái</h1>
        <div class="text-sm text-gray-500">Cập nhật lần cuối: Hôm nay</div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div class="w-12 h-12 rounded-full bg-ghg-100 flex items-center justify-center text-ghg-600 mr-4">
            <mat-icon>handshake</mat-icon>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Thành viên Mạng lưới</div>
            <div class="text-2xl font-bold text-gray-900">{{ dataService.partners().length }}</div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
            <mat-icon>map</mat-icon>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Dự án & Lộ trình</div>
            <div class="text-2xl font-bold text-gray-900">{{ dataService.roadmaps().length }}</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
            <mat-icon>event</mat-icon>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Sự kiện sắp tới</div>
            <div class="text-2xl font-bold text-gray-900">{{ dataService.events().length }}</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
            <mat-icon>assignment</mat-icon>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-500">Công việc đang xử lý</div>
            <div class="text-2xl font-bold text-gray-900">{{ pendingTasksCount() }}</div>
          </div>
        </div>
      </div>

      <!-- Combined Registrations -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <mat-icon class="mr-2 text-ghg-500">notifications</mat-icon>
            Yêu cầu phê duyệt mới
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          @for (item of allPendingRegistrations(); track item.id) {
            <div class="p-6 hover:bg-gray-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                      [class.bg-purple-100]="item.type === 'EVENT'"
                      [class.text-purple-800]="item.type === 'EVENT'"
                      [class.bg-ghg-100]="item.type === 'PARTNER'"
                      [class.text-ghg-800]="item.type === 'PARTNER'">
                      {{ item.type === 'EVENT' ? 'Sự kiện' : 'Đối tác' }}
                    </span>
                    <h3 class="text-sm font-medium text-gray-900">
                      {{ item.name }} 
                      <span class="text-gray-500 font-normal">
                        {{ item.type === 'EVENT' ? 'đã đăng ký tham gia' : 'muốn hợp tác' }}
                      </span> 
                      {{ item.displayDetail }}
                    </h3>
                  </div>
                  <div class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span class="flex items-center"><mat-icon class="text-[16px] mr-1">business</mat-icon> {{ item.displayOrg }}</span>
                    <span class="flex items-center"><mat-icon class="text-[16px] mr-1">email</mat-icon> {{ item.email }}</span>
                    <span class="flex items-center"><mat-icon class="text-[16px] mr-1">phone</mat-icon> {{ item.phone }}</span>
                  </div>
                </div>
                <div class="flex flex-col items-end ml-4">
                  <span class="text-xs text-gray-400 mb-3">{{ item.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                  <div class="flex gap-2">
                    <button (click)="approve(item)" class="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Chấp nhận">
                      <mat-icon class="text-[20px]">check_circle</mat-icon>
                    </button>
                    <button (click)="reject(item)" class="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Từ chối">
                      <mat-icon class="text-[20px]">cancel</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
          @if (allPendingRegistrations().length === 0) {
            <div class="p-12 text-center text-gray-500">
              <mat-icon class="text-4xl mb-2 opacity-20">done_all</mat-icon>
              <p>Không có yêu cầu phê duyệt mới nào.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent {
  dataService = inject(DataService);

  pendingTasksCount = computed(() => {
    return this.dataService.tasks().filter(t => t.status !== 'COMPLETED').length;
  });

  allPendingRegistrations = computed(() => {
    const eventRegs = this.dataService.eventRegistrations()
      .filter(r => r.status === 'PENDING')
      .map(r => ({ 
        ...r, 
        type: 'EVENT' as const,
        displayOrg: r.organization,
        displayDetail: this.getEventTitle(r.eventId)
      }));
    
    const partnerRegs = this.dataService.partnerRegistrations()
      .filter(r => r.status === 'PENDING')
      .map(r => ({ 
        ...r, 
        type: 'PARTNER' as const,
        displayOrg: r.company,
        displayDetail: r.company
      }));

    return [...eventRegs, ...partnerRegs].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  getEventTitle(eventId: string): string {
    const event = this.dataService.events().find(e => e.id === eventId);
    return event ? event.title : 'Sự kiện không xác định';
  }

  async approve(item: { type: 'EVENT' | 'PARTNER', id: string }) {
    const collection = item.type === 'EVENT' ? 'eventRegistrations' : 'partnerRegistrations';
    await this.dataService.updateData(collection, item.id, { status: 'APPROVED' });
  }

  async reject(item: { type: 'EVENT' | 'PARTNER', id: string }) {
    const collection = item.type === 'EVENT' ? 'eventRegistrations' : 'partnerRegistrations';
    await this.dataService.updateData(collection, item.id, { status: 'REJECTED' });
  }
}
