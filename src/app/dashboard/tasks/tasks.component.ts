import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DataService, Task } from '../../services/data.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Quản lý Công việc</h1>
        <button (click)="openModal()" class="inline-flex items-center px-4 py-2 bg-ghg-600 text-white rounded-lg hover:bg-ghg-700 text-sm font-medium transition-colors">
          <mat-icon class="mr-2 text-sm">add</mat-icon> Thêm Công việc
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div class="flex-1">
          <label for="filterRoadmap" class="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Lọc theo Dự án</label>
          <select id="filterRoadmap" [ngModel]="filterRoadmap()" (ngModelChange)="filterRoadmap.set($event)" class="w-full text-sm border-gray-300 rounded-lg focus:ring-ghg-500 focus:border-ghg-500">
            <option value="">Tất cả dự án</option>
            @for (roadmap of roadmaps(); track roadmap.id) {
              <option [value]="roadmap.id">{{ roadmap.projectName }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="flex gap-6 overflow-x-auto pb-4">
        <!-- Cần làm (PENDING) -->
        <div class="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 class="font-bold text-gray-700 mb-4 flex items-center justify-between">
            <span class="flex items-center"><mat-icon class="text-gray-400 mr-2 text-sm">list_alt</mat-icon> Cần làm</span>
            <span class="bg-gray-200 text-gray-600 text-xs py-0.5 px-2 rounded-full">{{ getTasksByStatus('PENDING').length }}</span>
          </h3>
          <div class="space-y-3">
            @for (task of getTasksByStatus('PENDING'); track task.id) {
              <ng-container *ngTemplateOutlet="taskCard; context: { $implicit: task }"></ng-container>
            }
          </div>
        </div>

        <!-- Đang làm (IN_PROGRESS) -->
        <div class="flex-1 min-w-[300px] bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 class="font-bold text-blue-800 mb-4 flex items-center justify-between">
            <span class="flex items-center"><mat-icon class="text-blue-500 mr-2 text-sm">play_circle_outline</mat-icon> Đang làm</span>
            <span class="bg-blue-200 text-blue-800 text-xs py-0.5 px-2 rounded-full">{{ getTasksByStatus('IN_PROGRESS').length }}</span>
          </h3>
          <div class="space-y-3">
            @for (task of getTasksByStatus('IN_PROGRESS'); track task.id) {
              <ng-container *ngTemplateOutlet="taskCard; context: { $implicit: task }"></ng-container>
            }
          </div>
        </div>

        <!-- Chờ duyệt (REVIEWING) -->
        <div class="flex-1 min-w-[300px] bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <h3 class="font-bold text-yellow-800 mb-4 flex items-center justify-between">
            <span class="flex items-center"><mat-icon class="text-yellow-500 mr-2 text-sm">hourglass_empty</mat-icon> Chờ duyệt</span>
            <span class="bg-yellow-200 text-yellow-800 text-xs py-0.5 px-2 rounded-full">{{ getTasksByStatus('REVIEWING').length }}</span>
          </h3>
          <div class="space-y-3">
            @for (task of getTasksByStatus('REVIEWING'); track task.id) {
              <ng-container *ngTemplateOutlet="taskCard; context: { $implicit: task }"></ng-container>
            }
          </div>
        </div>

        <!-- Hoàn thành (COMPLETED) -->
        <div class="flex-1 min-w-[300px] bg-ghg-50 rounded-xl p-4 border border-ghg-100">
          <h3 class="font-bold text-ghg-800 mb-4 flex items-center justify-between">
            <span class="flex items-center"><mat-icon class="text-ghg-500 mr-2 text-sm">check_circle</mat-icon> Hoàn thành</span>
            <span class="bg-ghg-200 text-ghg-800 text-xs py-0.5 px-2 rounded-full">{{ getTasksByStatus('COMPLETED').length }}</span>
          </h3>
          <div class="space-y-3">
            @for (task of getTasksByStatus('COMPLETED'); track task.id) {
              <ng-container *ngTemplateOutlet="taskCard; context: { $implicit: task }"></ng-container>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Task Card Template -->
    <ng-template #taskCard let-task>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group" (click)="editTask(task)" (keydown.enter)="editTask(task)" tabindex="0" role="button">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-medium text-gray-500 truncate max-w-[150px]">{{ getRoadmapName(task.roadmapId) }}</span>
          <button (click)="deleteTask(task.id, $event)" class="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <mat-icon class="text-sm">delete</mat-icon>
          </button>
        </div>
        <h4 class="font-medium text-gray-900 mb-3">{{ task.name }}</h4>
        <div class="flex justify-between items-center">
          <div class="flex -space-x-2 overflow-hidden">
            @for (assigneeId of task.assignees; track assigneeId) {
              <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-ghg-100 flex items-center justify-center text-ghg-700 font-bold text-xs" title="{{ getUserName(assigneeId) }}">
                {{ getUserName(assigneeId).charAt(0) }}
              </div>
            }
          </div>
          <div class="flex items-center text-xs text-gray-500">
            <mat-icon class="text-xs mr-1" [ngClass]="{'text-red-500': isOverdue(task.deadline) && task.status !== 'COMPLETED'}">schedule</mat-icon>
            <span [ngClass]="{'text-red-500 font-medium': isOverdue(task.deadline) && task.status !== 'COMPLETED'}">{{ task.deadline }}</span>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Modal Form -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div class="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
          <div class="flex justify-between items-center mb-5">
            <h3 class="text-lg font-bold text-gray-900">{{ editingId() ? 'Sửa Công việc' : 'Thêm Công việc mới' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <form (ngSubmit)="saveTask()" class="space-y-4">
            <div>
              <label for="taskName" class="block text-sm font-medium text-gray-700 mb-1">Tên công việc</label>
              <input id="taskName" type="text" [(ngModel)]="formData.name" name="name" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
            </div>

            <div>
              <label for="taskDesc" class="block text-sm font-medium text-gray-700 mb-1">Nội dung / Mô tả</label>
              <textarea id="taskDesc" [(ngModel)]="formData.description" name="description" rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500"></textarea>
            </div>
            
            <div>
              <label for="roadmapId" class="block text-sm font-medium text-gray-700 mb-1">Dự án / Lộ trình</label>
              <select id="roadmapId" [(ngModel)]="formData.roadmapId" name="roadmapId" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                @for (roadmap of roadmaps(); track roadmap.id) {
                  <option [value]="roadmap.id">{{ roadmap.projectName }}</option>
                }
              </select>
            </div>
            
            <div>
              <label for="assignees" class="block text-sm font-medium text-gray-700 mb-1">Người thực hiện (Chọn nhiều)</label>
              <select id="assignees" multiple [(ngModel)]="formData.assignees" name="assignees" required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500 h-24">
                @for (user of users(); track user.id) {
                  <option [value]="user.id">{{ user.fullName }} ({{ user.department }})</option>
                }
              </select>
              <p class="text-xs text-gray-500 mt-1">Giữ phím Ctrl (hoặc Cmd) để chọn nhiều người</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">Hạn chót (Deadline)</label>
                <input id="deadline" type="date" [(ngModel)]="formData.deadline" name="deadline" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select id="status" [(ngModel)]="formData.status" name="status" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ghg-500 focus:border-ghg-500">
                  <option value="PENDING">Cần làm</option>
                  <option value="IN_PROGRESS">Đang làm</option>
                  <option value="REVIEWING">Chờ duyệt</option>
                  <option value="COMPLETED">Hoàn thành</option>
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
          <p class="text-sm text-gray-500 mb-6">Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.</p>
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
export class TasksComponent {
  dataService = inject(DataService);
  
  tasks = this.dataService.tasks;
  users = this.dataService.users;
  roadmaps = this.dataService.roadmaps;

  filterRoadmap = signal<string>('');
  
  isModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  editingId = signal<string | null>(null);
  deletingId = signal<string | null>(null);
  formData: Partial<Task> = {};

  getTasksByStatus(status: string): Task[] {
    let filtered = this.tasks().filter(t => t.status === status || (status === 'PENDING' && t.status === 'OVERDUE'));
    if (this.filterRoadmap()) {
      filtered = filtered.filter(t => t.roadmapId === this.filterRoadmap());
    }
    return filtered;
  }

  getUserName(userId: string): string {
    const user = this.users().find(u => u.id === userId);
    return user ? user.fullName : 'Unknown';
  }

  getRoadmapName(roadmapId: string): string {
    const roadmap = this.roadmaps().find(r => r.id === roadmapId);
    return roadmap ? roadmap.projectName : 'Unknown';
  }

  isOverdue(deadline: string): boolean {
    return new Date(deadline) < new Date();
  }

  openModal() {
    this.editingId.set(null);
    this.formData = {
      name: '',
      description: '',
      roadmapId: this.roadmaps()[0]?.id,
      assignees: [],
      status: 'PENDING',
      deadline: new Date().toISOString().split('T')[0]
    };
    this.isModalOpen.set(true);
  }

  editTask(task: Task) {
    this.editingId.set(task.id);
    this.formData = { ...task };
    this.isModalOpen.set(true);
  }

  deleteTask(id: string, event: Event) {
    event.stopPropagation();
    this.deletingId.set(id);
    this.isDeleteModalOpen.set(true);
  }

  async confirmDelete() {
    const id = this.deletingId();
    if (id) {
      await this.dataService.deleteData('tasks', id);
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

  async saveTask() {
    if (this.editingId()) {
      const id = this.editingId()!;
      await this.dataService.updateData('tasks', id, this.formData);
    } else {
      await this.dataService.addData('tasks', this.formData);
    }
    this.closeModal();
  }
}
