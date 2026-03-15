import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, User } from '../../services/data.service';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Nhân sự & Thành viên</h1>
        <button (click)="openModal()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">person_add</mat-icon> Thêm Thành viên
        </button>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ / Đơn vị</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò (Role)</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-ghg-100 flex items-center justify-center text-ghg-700 font-bold text-xs mr-3">
                        {{ user.fullName.charAt(0) }}
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user.fullName }}</div>
                        <div class="text-xs text-gray-500">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.position }}</div>
                    <div class="text-xs text-gray-500">{{ user.department }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-purple-100 text-purple-800': user.role === 'ADMIN',
                        'bg-blue-100 text-blue-800': user.role === 'STAFF',
                        'bg-ghg-100 text-ghg-800': user.role === 'EXPERT',
                        'bg-orange-100 text-orange-800': user.role === 'ENTERPRISE',
                        'bg-teal-100 text-teal-800': user.role === 'STARTUP'
                      }">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-3"><mat-icon class="text-sm">edit</mat-icon></button>
                    <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900"><mat-icon class="text-sm">delete</mat-icon></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-gray-900">{{ editingId() ? 'Sửa Thành viên' : 'Thêm Thành viên mới' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form (ngSubmit)="saveUser()" class="space-y-4">
            <div>
              <label for="personnelName" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input id="personnelName" type="text" [(ngModel)]="formData.fullName" name="fullName" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div>
              <label for="personnelEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="personnelEmail" type="email" [(ngModel)]="formData.email" name="email" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="personnelPos" class="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <input id="personnelPos" type="text" [(ngModel)]="formData.position" name="position" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="personnelDept" class="block text-sm font-medium text-gray-700 mb-1">Đơn vị / Phòng ban</label>
                <input id="personnelDept" type="text" [(ngModel)]="formData.department" name="department" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div>
              <label for="personnelRole" class="block text-sm font-medium text-gray-700 mb-1">Vai trò (Role)</label>
              <select id="personnelRole" [(ngModel)]="formData.role" name="role" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="EXPERT">EXPERT</option>
                <option value="ENTERPRISE">ENTERPRISE</option>
                <option value="STARTUP">STARTUP</option>
              </select>
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
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.</p>
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
export class PersonnelComponent {
  dataService = inject(DataService);
  users = this.dataService.users;

  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  formData: Partial<User> = {};

  openModal() {
    this.editingId.set(null);
    this.formData = {
      fullName: '',
      email: '',
      position: '',
      department: '',
      role: 'STAFF'
    };
    this.isModalOpen.set(true);
  }

  editUser(user: User) {
    this.editingId.set(user.id);
    this.formData = { ...user };
    this.isModalOpen.set(true);
  }

  deleteUser(id: string) {
    this.deletingId.set(id);
    this.isDeleteModalOpen.set(true);
  }

  async confirmDelete() {
    const id = this.deletingId();
    if (id) {
      await this.dataService.deleteData('users', id);
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

  async saveUser() {
    if (this.editingId()) {
      const id = this.editingId()!;
      await this.dataService.updateData('users', id, this.formData);
    } else {
      await this.dataService.addData('users', this.formData);
    }
    this.closeModal();
  }
}
