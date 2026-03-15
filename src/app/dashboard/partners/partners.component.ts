import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Partner } from '../../services/data.service';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Mạng lưới Đối tác</h1>
        <button (click)="openModal()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">handshake</mat-icon> Thêm Đối tác
        </button>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button (click)="activeTab.set('LIST')"
            [class.border-ghg-500]="activeTab() === 'LIST'"
            [class.text-ghg-600]="activeTab() === 'LIST'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Danh sách Đối tác
          </button>
          <button (click)="activeTab.set('REQUESTS')"
            [class.border-ghg-500]="activeTab() === 'REQUESTS'"
            [class.text-ghg-600]="activeTab() === 'REQUESTS'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 relative">
            Yêu cầu Đăng ký
            @if (pendingRequestsCount() > 0) {
              <span class="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{{ pendingRequestsCount() }}</span>
            }
          </button>
        </nav>
      </div>

      @if (activeTab() === 'LIST') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (partner of partners(); track partner.id) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative group">
              <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button (click)="editPartner(partner)" class="text-indigo-600 hover:text-indigo-900"><mat-icon class="text-sm">edit</mat-icon></button>
                <button (click)="deletePartner(partner.id)" class="text-red-600 hover:text-red-900"><mat-icon class="text-sm">delete</mat-icon></button>
              </div>
              
              <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 overflow-hidden">
                @if (partner.logoUrl) {
                  <img [src]="partner.logoUrl" [alt]="partner.name" class="w-full h-full object-cover" referrerpolicy="no-referrer">
                } @else {
                  <mat-icon class="text-3xl text-gray-400">business</mat-icon>
                }
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">{{ partner.name }}</h3>
              <p class="text-sm text-gray-500 mb-4">{{ partner.industry }}</p>
              
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  [ngClass]="{
                    'bg-blue-100 text-blue-800': partner.type === 'ENTERPRISE',
                    'bg-ghg-100 text-ghg-800': partner.type === 'STARTUP',
                    'bg-purple-100 text-purple-800': partner.type === 'INVESTOR',
                    'bg-orange-100 text-orange-800': partner.type === 'NGO'
                  }">
                  {{ partner.type }}
                </span>
                <span class="text-xs text-gray-400">Từ {{ partner.joinDate }}</span>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đối tác / Công ty</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người liên hệ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (reg of partnerRegistrations(); track reg.id) {
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ reg.company }}</div>
                    <div class="text-xs text-gray-500">{{ reg.type }} - {{ reg.industry }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ reg.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{{ reg.email }}</div>
                    <div>{{ reg.phone }}</div>
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
              @if (partnerRegistrations().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    Không có yêu cầu đăng ký nào.
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
            <h3 class="text-lg font-bold text-gray-900">{{ editingId() ? 'Sửa Đối tác' : 'Thêm Đối tác mới' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form (ngSubmit)="savePartner()" class="space-y-4">
            <div>
              <label for="partnerName" class="block text-sm font-medium text-gray-700 mb-1">Tên đối tác</label>
              <input id="partnerName" type="text" [(ngModel)]="formData.name" name="name" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div>
              <label for="partnerIndustry" class="block text-sm font-medium text-gray-700 mb-1">Ngành nghề / Lĩnh vực</label>
              <input id="partnerIndustry" type="text" [(ngModel)]="formData.industry" name="industry" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="partnerType" class="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
                <select id="partnerType" [(ngModel)]="formData.type" name="type" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                  <option value="ENTERPRISE">Doanh nghiệp</option>
                  <option value="STARTUP">Startup</option>
                  <option value="INVESTOR">Nhà đầu tư</option>
                  <option value="NGO">Tổ chức phi chính phủ</option>
                </select>
              </div>
              <div>
                <label for="partnerJoinDate" class="block text-sm font-medium text-gray-700 mb-1">Ngày tham gia</label>
                <input id="partnerJoinDate" type="date" [(ngModel)]="formData.joinDate" name="joinDate" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="partnerEmail" class="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                <input id="partnerEmail" type="email" [(ngModel)]="formData.contactEmail" name="contactEmail"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="partnerWebsite" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input id="partnerWebsite" type="text" [(ngModel)]="formData.website" name="website" placeholder="https://..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div>
              <label for="partnerLogoUrl" class="block text-sm font-medium text-gray-700 mb-1">URL Logo</label>
              <input id="partnerLogoUrl" type="text" [(ngModel)]="formData.logoUrl" name="logoUrl" placeholder="https://..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
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
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa đối tác này? Hành động này không thể hoàn tác.</p>
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
export class PartnersComponent {
  dataService = inject(DataService);
  partners = this.dataService.partners;
  partnerRegistrations = this.dataService.partnerRegistrations;

  activeTab = signal<'LIST' | 'REQUESTS'>('LIST');
  pendingRequestsCount = computed(() => {
    return this.dataService.partnerRegistrations().filter(r => r.status === 'PENDING').length;
  });

  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  formData: Partial<Partner> = {};

  openModal() {
    this.editingId.set(null);
    this.formData = {
      name: '',
      type: 'ENTERPRISE',
      industry: '',
      joinDate: new Date().toISOString().split('T')[0]
    };
    this.isModalOpen.set(true);
  }

  editPartner(partner: Partner) {
    this.editingId.set(partner.id);
    this.formData = { ...partner };
    this.isModalOpen.set(true);
  }

  deletePartner(id: string) {
    this.deletingId.set(id);
    this.isDeleteModalOpen.set(true);
  }

  async confirmDelete() {
    const id = this.deletingId();
    if (id) {
      await this.dataService.deleteData('partners', id);
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

  async savePartner() {
    if (this.editingId()) {
      const id = this.editingId()!;
      await this.dataService.updateData('partners', id, this.formData);
    } else {
      await this.dataService.addData('partners', this.formData);
    }
    this.closeModal();
  }

  async approveRequest(id: string) {
    await this.dataService.updateData('partnerRegistrations', id, { status: 'APPROVED' });
  }

  async rejectRequest(id: string) {
    await this.dataService.updateData('partnerRegistrations', id, { status: 'REJECTED' });
  }

  async deleteRequest(id: string) {
    await this.dataService.deleteData('partnerRegistrations', id);
  }
}
