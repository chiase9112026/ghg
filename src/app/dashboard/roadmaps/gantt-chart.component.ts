import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full overflow-x-auto pb-4">
      <div class="min-w-[800px]">
        <!-- Timeline Header (Months) -->
        <div class="flex border-b border-gray-200 mb-4">
          <div class="w-48 flex-shrink-0 py-2 px-4 font-semibold text-gray-600 text-sm border-r border-gray-200">
            Dự án / Hạng mục
          </div>
          <div class="flex-1 flex">
            @for (month of months(); track month.label) {
              <div class="flex-1 text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-100 last:border-r-0">
                {{ month.label }}
              </div>
            }
          </div>
        </div>

        <!-- Gantt Rows -->
        <div class="space-y-3 relative">
          <!-- Background Grid Lines -->
          <div class="absolute inset-0 flex ml-48 pointer-events-none">
             @for (month of months(); track month.label) {
               <div class="flex-1 border-r border-gray-100 border-dashed last:border-r-0"></div>
             }
          </div>

          @for (task of roadmapTasks(); track task.id) {
            <div class="flex items-center group">
              <!-- Task Name -->
              <div class="w-48 flex-shrink-0 pr-4 py-2 text-sm font-medium text-gray-800 truncate" [title]="task.name">
                {{ task.name }}
              </div>
              
              <!-- Task Bar Area -->
              <div class="flex-1 relative h-8 bg-gray-50 rounded-md overflow-hidden">
                <!-- The Bar -->
                <div 
                  class="absolute top-1 bottom-1 rounded-md shadow-sm flex items-center px-3 transition-all duration-300 hover:opacity-90 cursor-pointer"
                  [style.left.%]="getLeftPosition(task)"
                  [style.width.%]="getWidth(task)"
                  [style.background-color]="task.color"
                >
                  <!-- Progress Fill -->
                  <div 
                    class="absolute left-0 top-0 bottom-0 bg-black bg-opacity-20 rounded-l-md"
                    [style.width.%]="task.progress"
                    [class.rounded-r-md]="task.progress === 100"
                  ></div>
                  
                  <span class="relative z-10 text-xs font-bold text-white truncate drop-shadow-md">
                    {{ task.progress }}%
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
        
        <!-- Legend -->
        <div class="mt-6 flex items-center justify-end space-x-4 text-xs text-gray-500">
          <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-emerald-500 mr-1.5"></span> Hoàn thành tốt</div>
          <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></span> Đang diễn ra</div>
          <div class="flex items-center"><span class="w-3 h-3 rounded-full bg-amber-500 mr-1.5"></span> Cần chú ý</div>
        </div>
      </div>
    </div>
  `
})
export class GanttChartComponent {
  dataService = inject(DataService);
  roadmaps = this.dataService.roadmaps;

  // Calculate timeline span based on data
  timelineStart = computed(() => {
    const dates = this.roadmaps().map(r => new Date(r.startDate).getTime());
    if (dates.length === 0) return new Date(new Date().getFullYear(), 0, 1);
    const minDate = new Date(Math.min(...dates));
    return new Date(minDate.getFullYear(), minDate.getMonth(), 1); // Start of the earliest month
  });

  timelineEnd = computed(() => {
    const dates = this.roadmaps().map(r => new Date(r.endDate).getTime());
    if (dates.length === 0) return new Date(new Date().getFullYear(), 11, 31);
    const maxDate = new Date(Math.max(...dates));
    return new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0); // End of the latest month
  });

  totalDuration = computed(() => {
    return this.timelineEnd().getTime() - this.timelineStart().getTime();
  });

  roadmapTasks = computed(() => {
    return this.roadmaps().map(r => {
      let color = '#3b82f6'; // blue (ONGOING)
      if (r.status === 'COMPLETED') color = '#10b981'; // emerald
      else if (r.status === 'ON_HOLD') color = '#f59e0b'; // amber
      else if (r.status === 'PLANNING') color = '#9ca3af'; // gray

      return {
        id: r.id,
        name: r.projectName,
        startDate: new Date(r.startDate),
        endDate: new Date(r.endDate),
        progress: r.progress,
        color: color
      };
    });
  });

  months = computed(() => {
    const start = this.timelineStart();
    const end = this.timelineEnd();
    const monthsList = [];
    
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      monthsList.push({ 
        label: `T${current.getMonth() + 1}/${current.getFullYear().toString().substr(2)}` 
      });
      current.setMonth(current.getMonth() + 1);
    }
    return monthsList;
  });

  getLeftPosition(task: { startDate: Date }): number {
    const startOffset = task.startDate.getTime() - this.timelineStart().getTime();
    return Math.max(0, (startOffset / this.totalDuration()) * 100);
  }

  getWidth(task: { startDate: Date, endDate: Date }): number {
    const taskDuration = task.endDate.getTime() - task.startDate.getTime();
    const width = (taskDuration / this.totalDuration()) * 100;
    // Ensure it doesn't overflow the container if end date is past timeline end
    const left = this.getLeftPosition(task);
    return Math.min(width, 100 - left);
  }
}
