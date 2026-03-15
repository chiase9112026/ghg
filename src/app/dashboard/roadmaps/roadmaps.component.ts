import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GanttChartComponent } from './gantt-chart.component';
import { DataService, Roadmap } from '../../services/data.service';

@Component({
  selector: 'app-roadmaps',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, GanttChartComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Lộ trình & Dự án</h1>
        <button (click)="openModal()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">add</mat-icon> Thêm Lộ trình
        </button>
      </div>

      <!-- Gantt Chart -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <mat-icon class="mr-2 text-ghg-500">timeline</mat-icon>
          Biểu đồ Tiến độ (Gantt Chart)
        </h2>
        <app-gantt-chart></app-gantt-chart>
      </div>

      <!-- Roadmaps Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <mat-icon class="mr-2 text-blue-500">view_list</mat-icon>
            Danh sách Dự án
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dự án / Lộ trình</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người quản lý</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiến độ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (item of roadmaps(); track item.id) {
                <tr class="hover:bg-gray-50 transition-colors cursor-pointer" (click)="viewDetails(item)">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ item.projectName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getUserName(item.manager) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.startDate }} - {{ item.endDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                        <div class="bg-ghg-500 h-2.5 rounded-full" [style.width.%]="item.progress"></div>
                      </div>
                      <span class="text-xs text-gray-500">{{ item.progress }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      [ngClass]="{
                        'bg-gray-100 text-gray-800': item.status === 'PLANNING',
                        'bg-blue-100 text-blue-800': item.status === 'ONGOING',
                        'bg-yellow-100 text-yellow-800': item.status === 'ON_HOLD',
                        'bg-ghg-100 text-ghg-800': item.status === 'COMPLETED'
                      }">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="editRoadmap(item, $event)" class="text-indigo-600 hover:text-indigo-900 mr-3"><mat-icon class="text-sm">edit</mat-icon></button>
                    <button (click)="deleteRoadmap(item.id, $event)" class="text-red-600 hover:text-red-900"><mat-icon class="text-sm">delete</mat-icon></button>
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
            <h3 class="text-lg font-bold text-gray-900">{{ editingId() ? 'Sửa Lộ trình' : 'Thêm Lộ trình mới' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form (ngSubmit)="saveRoadmap()" class="space-y-4">
            <div>
              <label for="roadmapProject" class="block text-sm font-medium text-gray-700 mb-1">Tên dự án / Lộ trình</label>
              <input id="roadmapProject" type="text" [(ngModel)]="formData.projectName" name="projectName" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>
            
            <div>
              <label for="roadmapManager" class="block text-sm font-medium text-gray-700 mb-1">Người quản lý</label>
              <select id="roadmapManager" [(ngModel)]="formData.manager" name="manager" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                @for (user of users(); track user.id) {
                  <option [value]="user.id">{{ user.fullName }}</option>
                }
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="roadmapStart" class="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                <input id="roadmapStart" type="date" [(ngModel)]="formData.startDate" name="startDate" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="roadmapEnd" class="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                <input id="roadmapEnd" type="date" [(ngModel)]="formData.endDate" name="endDate" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="roadmapProgress" class="block text-sm font-medium text-gray-700 mb-1">Tiến độ (%)</label>
                <input id="roadmapProgress" type="number" min="0" max="100" [(ngModel)]="formData.progress" name="progress" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="roadmapStatus" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select id="roadmapStatus" [(ngModel)]="formData.status" name="status" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                  <option value="PLANNING">PLANNING</option>
                  <option value="ONGOING">ONGOING</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
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
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa lộ trình này? Hành động này không thể hoàn tác.</p>
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

    <!-- Details Modal -->
    @if (selectedRoadmap()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6">
          <div class="flex justify-between items-start mb-5">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedRoadmap()?.projectName }}</h3>
              <p class="text-sm text-gray-500 mt-1">Chi tiết dự án</p>
            </div>
            <button (click)="closeDetails()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500 text-sm">Người quản lý:</span>
              <span class="font-medium text-gray-900">{{ getUserName(selectedRoadmap()?.manager || '') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500 text-sm">Thời gian:</span>
              <span class="font-medium text-gray-900">{{ selectedRoadmap()?.startDate }} đến {{ selectedRoadmap()?.endDate }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500 text-sm">Trạng thái:</span>
              <span class="font-medium text-gray-900">{{ selectedRoadmap()?.status }}</span>
            </div>
            <div class="py-2 border-b border-gray-100">
              <div class="flex justify-between mb-1">
                <span class="text-gray-500 text-sm">Tiến độ:</span>
                <span class="font-medium text-gray-900">{{ selectedRoadmap()?.progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-ghg-500 h-2 rounded-full" [style.width.%]="selectedRoadmap()?.progress"></div>
              </div>
            </div>
            
            <div class="pt-2">
              <span class="text-gray-500 text-sm block mb-2">Thành viên đang tham gia (Tasks):</span>
              <div class="flex flex-wrap gap-2">
                @for (member of getProjectMembers(selectedRoadmap()?.id || ''); track member.id) {
                  <div class="flex items-center bg-gray-100 rounded-full px-3 py-1">
                    <div class="h-6 w-6 rounded-full bg-ghg-100 flex items-center justify-center text-ghg-700 font-bold text-xs mr-2">
                      {{ member.fullName.charAt(0) }}
                    </div>
                    <span class="text-xs font-medium">{{ member.fullName }}</span>
                  </div>
                }
                @if (getProjectMembers(selectedRoadmap()?.id || '').length === 0) {
                  <span class="text-xs text-gray-400 italic">Chưa có thành viên nào được giao việc</span>
                }
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button (click)="closeDetails()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
              Đóng
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class RoadmapsComponent {
  dataService = inject(DataService);
  
  roadmaps = this.dataService.roadmaps;
  users = this.dataService.users;
  tasks = this.dataService.tasks;

  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  selectedRoadmap = signal<Roadmap | null>(null);

  formData: Partial<Roadmap> = {};

  getUserName(userId: string): string {
    const user = this.users().find(u => u.id === userId);
    return user ? user.fullName : 'Unknown';
  }

  getProjectMembers(roadmapId: string) {
    const projectTasks = this.tasks().filter(t => t.roadmapId === roadmapId);
    const memberIds = new Set<string>();
    projectTasks.forEach(t => {
      t.assignees.forEach(id => memberIds.add(id));
    });
    
    return this.users().filter(u => memberIds.has(u.id));
  }

  openModal() {
    this.editingId.set(null);
    this.formData = {
      projectName: '',
      manager: this.users()[0]?.id,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      progress: 0,
      status: 'PLANNING'
    };
    this.isModalOpen.set(true);
  }

  editRoadmap(roadmap: Roadmap, event: Event) {
    event.stopPropagation();
    this.editingId.set(roadmap.id);
    this.formData = { ...roadmap };
    this.isModalOpen.set(true);
  }

  deleteRoadmap(id: string, event: Event) {
    event.stopPropagation();
    this.deletingId.set(id);
    this.isDeleteModalOpen.set(true);
  }

  async confirmDelete() {
    const id = this.deletingId();
    if (id) {
      await this.dataService.deleteData('roadmaps', id);
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

  async saveRoadmap() {
    if (this.editingId()) {
      const id = this.editingId()!;
      await this.dataService.updateData('roadmaps', id, this.formData);
    } else {
      await this.dataService.addData('roadmaps', this.formData);
    }
    this.closeModal();
  }

  viewDetails(roadmap: Roadmap) {
    this.selectedRoadmap.set(roadmap);
  }

  closeDetails() {
    this.selectedRoadmap.set(null);
  }
}
