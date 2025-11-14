import { Component, computed, inject } from '@angular/core';
import { TaskBoardService } from '../../service/task-board.service';
import { TaskCard, TaskStatus } from '../../model/kanban';
import Swal from 'sweetalert2';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, FormsModule],
  templateUrl: './task-board.component.html',
  styleUrl: './task-board.component.css'
})
export class TaskBoardComponent {
   isEditOpen = false;
  editingTaskId: number | null = null;

  editTitle = '';
  editDescription = '';
  editTags = '';
  editProgressPercent = 0;
  editStatus: TaskStatus = 'todo';

 
 private readonly svc = inject(TaskBoardService);
  readonly columns = this.svc.columns;
  readonly totalTasks = this.svc.totalTasks;

  // ใช้ทำ progress dots 12 จุด
  readonly progressDots = Array.from({ length: 12 });

  getTasks(col: TaskStatus) {
    return this.svc.getTasksByStatus(col);
  }

  /** ปุ่ม + ในแต่ละคอลัมน์ */
  async onAddTask(col: TaskStatus) {
    const { value: formValues } = await Swal.fire({
      title: 'Create task',
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description"></textarea>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value;
        const desc = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;
        if (!title) return Swal.showValidationMessage('Title is required');
        return { title, desc };
      },
      confirmButtonText: 'Save',
      showCancelButton: true,
    });

    if (formValues) {
      this.svc.addTask(col, formValues.title, formValues.desc);
      Swal.fire('Added!', 'Task created successfully.', 'success');
    }
  }

  /** ปุ่ม Create task ด้านขวาบน */
  onCreateTaskMain() {
    // ให้ไปเพิ่มในคอลัมน์ Todo list เป็น default
    this.onAddTask('todo');
  }

  /** ดับเบิลคลิก / คลิกที่การ์ดเพื่อแก้ข้อมูล */
 openEditModal(task: TaskCard) {
    this.isEditOpen = true;
    this.editingTaskId = task.id;

    this.editTitle = task.title;
    this.editDescription = task.description;
    this.editTags = task.tags?.join(', ') ?? '';
    this.editProgressPercent = task.progressPercent ?? 0;
    this.editStatus = task.status;
  }

  closeEditModal() {
    this.isEditOpen = false;
    this.editingTaskId = null;
  }

 saveEditModal() {
  if (!this.editingTaskId) return;

  const title = this.editTitle.trim();
  if (!title) {
    Swal.fire('Title required', '', 'warning');
    return;
  }

  const tags = this.editTags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const progressPercent = Math.min(
    Math.max(this.editProgressPercent || 0, 0),
    100
  );

  this.svc.editTaskFull(this.editingTaskId, {
    title,
    description: this.editDescription,
    tags,
    progressPercent,
    status: this.editStatus,
  });

  Swal.fire('Saved!', 'Task updated successfully.', 'success');

  this.closeEditModal();
}

  async onAdjustTaskMeta(task: TaskCard, event: MouseEvent) {
    event.stopPropagation(); 

    const currentPercent = task.progressPercent ?? 0;
    const tagsString = task.tags?.join(', ') ?? '';

    const { value: formValues } = await Swal.fire({
      title: 'ปรับ Progress / ประเภทงาน',
      html: `
        <div style="text-align:left; font-size:12px; margin-bottom:4px;">Progress (%)</div>
        <input id="swal-progress" type="range" min="0" max="100" step="10"
               class="swal2-range" value="${currentPercent}">
        <div style="text-align:left; font-size:12px; margin-top:10px;">ประเภทงาน (คั่นด้วย , )</div>
        <input id="swal-tags" class="swal2-input" placeholder="#website, #client" value="${tagsString}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const progressInput = document.getElementById('swal-progress') as HTMLInputElement;
        const tagsInput = document.getElementById('swal-tags') as HTMLInputElement;

        const percent = Number(progressInput.value) || 0;

        const tags =
          tagsInput.value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        // แปลง % เป็นจำนวนจุด (0–12)
        const progressDots = Math.round((percent / 100) * 12);

        return {
          progressPercent: percent,
          progress: progressDots,
          tags,
        };
      },
      confirmButtonText: 'Save',
      showCancelButton: true,
    });

    if (formValues) {
      this.svc.updateTaskMeta(task.id, formValues);
      Swal.fire('Updated!', 'Progress & ประเภทงานถูกแก้ไขแล้ว.', 'success');
    }
  }

  /** ปุ่มลบการ์ด */
  async onDeleteTask(task: TaskCard, event: MouseEvent) {
    event.stopPropagation(); // กันไม่ให้ไป trigger onEditTask

    const confirm = await Swal.fire({
      title: 'Delete task?',
      text: `Do you want to delete "${task.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });

    if (confirm.isConfirmed) {
      this.svc.deleteTask(task.id);
      Swal.fire('Deleted!', '', 'success');
    }
  }

  /** ปุ่มเมนู sidebar / header ทั่วไป */
  onNav(section: string) {
    Swal.fire({
      title: section,
      text: `You clicked "${section}". You can hook router / feature here.`,
      icon: 'info',
    });
  }

  onFilterClick() {
    Swal.fire({
      title: 'Filters',
      text: 'Open filter panel here.',
      icon: 'info',
    });
  }

  onNotificationClick() {
    Swal.fire({
      title: 'Notifications',
      text: 'Show notifications panel here.',
      icon: 'info',
    });
  }

  onSettingsClick() {
    Swal.fire({
      title: 'Settings',
      text: 'Open settings screen here.',
      icon: 'info',
    });
  }

  onSearchShortcut() {
    Swal.fire({
      title: 'Search',
      text: 'Implement global search here.',
      icon: 'info',
    });
  }
}