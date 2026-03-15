import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 class="text-2xl font-bold text-gray-900">Lịch Công Việc & Sự Kiện</h1>
        <div class="flex items-center gap-4">
          <button (click)="prevMonth()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span class="text-lg font-medium text-gray-900 w-32 text-center">
            Tháng {{ currentMonth() + 1 }}/{{ currentYear() }}
          </span>
          <button (click)="nextMonth()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
          @for (day of ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']; track day) {
            <div class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
              {{ day }}
            </div>
          }
        </div>
        
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          @for (day of calendarDays(); track day.date) {
            <div class="min-h-[120px] bg-white p-2" [class.bg-gray-50]="!day.isCurrentMonth">
              <div class="flex justify-between items-start">
                <span class="text-sm font-medium" 
                      [class.text-gray-900]="day.isCurrentMonth" 
                      [class.text-gray-400]="!day.isCurrentMonth"
                      [class.bg-ghg-500]="day.isToday"
                      [class.text-white]="day.isToday"
                      [class.rounded-full]="day.isToday"
                      [class.w-6]="day.isToday"
                      [class.h-6]="day.isToday"
                      [class.flex]="day.isToday"
                      [class.items-center]="day.isToday"
                      [class.justify-center]="day.isToday">
                  {{ day.date.getDate() }}
                </span>
              </div>
              
              <div class="mt-2 space-y-1">
                @for (event of day.events; track event.id) {
                  <div class="px-2 py-1 text-xs rounded-md truncate bg-ghg-50 text-ghg-700 border border-ghg-100" title="{{ event.title }}">
                    {{ event.title }}
                  </div>
                }
                @for (task of day.tasks; track task.id) {
                  <div class="px-2 py-1 text-xs rounded-md truncate bg-blue-50 text-blue-700 border border-blue-100" title="{{ task.name }}">
                    {{ task.name }}
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CalendarComponent {
  dataService = inject(DataService);
  
  currentDate = signal(new Date());
  
  currentMonth = computed(() => this.currentDate().getMonth());
  currentYear = computed(() => this.currentDate().getFullYear());
  
  events = this.dataService.events;
  tasks = this.dataService.tasks;

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createDayObject(date, false));
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(this.createDayObject(date, true));
    }
    
    // Next month days to fill the grid (42 cells total for 6 rows)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createDayObject(date, false));
    }
    
    return days;
  });

  createDayObject(date: Date, isCurrentMonth: boolean) {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
                    
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // Find events for this day
    const dayEvents = this.events().filter(e => e.date.startsWith(dateString));
    
    // Find tasks with deadline on this day
    const dayTasks = this.tasks().filter(t => t.deadline === dateString);

    return {
      date,
      isCurrentMonth,
      isToday,
      events: dayEvents,
      tasks: dayTasks
    };
  }

  prevMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate.set(newDate);
  }

  nextMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate.set(newDate);
  }
}
