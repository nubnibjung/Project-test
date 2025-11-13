// src/app/members/member.component.ts
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MemberService } from '../../service/member.service';
import { Member } from '../../model/member';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member',
  standalone: true,
  templateUrl: './member.component.html',
  imports: [CommonModule, FormsModule],
  styleUrl: './member.component.css'
})
export class MemberComponent {
  private svc = inject(MemberService);

  // ===== list state (signals) =====
  search = signal('');
  statusFilter = signal<'all' | 'Active' | 'Inactive'>('all');
  members = this.svc.members;

  filteredMembers = computed(() => {
    const term = this.search().trim().toLowerCase();
    const filter = this.statusFilter();

    return this.members().filter((m) => {
      const matchTerm =
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.mobile.toLowerCase().includes(term);

      const matchStatus = filter === 'all' ? true : m.status === filter;
      return matchTerm && matchStatus;
    });
  });

  // ===== modal & form state =====
  modalOpen = signal(false);
  mode: 'add' | 'edit' = 'add';

  formMember: Member = this.createEmptyMember();

  private createEmptyMember(): Member {
    return {
      id: 0,
      name: '',
      email: '',
      mobile: '',
      status: 'Active',
      photoUrl: '',
    };
  }

  // สำหรับ [(ngModel)] search
  get searchValue() {
    return this.search();
  }
  set searchValue(val: string) {
    this.search.set(val);
  }

  // ===== actions =====
  openAdd() {
    this.mode = 'add';
    this.formMember = this.createEmptyMember();
    this.modalOpen.set(true);
  }

  openEdit(m: Member) {
    this.mode = 'edit';
    this.formMember = { ...m };
    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.formMember = this.createEmptyMember();
  }

  // upload รูป -> เก็บ base64
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.formMember.photoUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ===== SAVE + ALERT ครบทุกเคส =====
  onSubmit(form: NgForm) {
    // 1) form invalid (required/minlength/etc.)
    if (form.invalid) {
      form.control.markAllAsTouched();

      Swal.fire({
        icon: 'error',
        title: 'Invalid data',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#7c3aed',
      });

      return;
    }

    // 2) email ต้องมี '@' อย่างน้อย 1 ตัว
    const email = this.formMember.email.trim();
    if (!email.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid email',
        text: 'Email must contain the "@" symbol.',
        confirmButtonColor: '#7c3aed',
      });
      return;
    }

    // 3) ถามยืนยันก่อน Save
    Swal.fire({
      icon: 'question',
      title: this.mode === 'add' ? 'Add this member?' : 'Save changes?',
      text:
        this.mode === 'add'
          ? 'Do you want to add this new member?'
          : 'Do you want to save the changes to this member?',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#9ca3af',
    }).then((result) => {
      if (!result.isConfirmed) {
        // ผู้ใช้กด cancel -> ไม่ทำอะไรต่อ
        return;
      }

      // 4) บันทึกจริง
      if (this.mode === 'add') {
        const { id, ...payload } = this.formMember;
        this.svc.add(payload);
      } else {
        this.svc.update(this.formMember);
      }

      // 5) success หลัง Save
      Swal.fire({
        icon: 'success',
        title: this.mode === 'add' ? 'Member added' : 'Member updated',
        showConfirmButton: false,
        timer: 1200,
      });

      this.closeModal();
    });
  }

  // ===== DELETE + ALERT =====
  deleteMember(id: number) {
    Swal.fire({
      icon: 'warning',
      title: 'Delete member?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e02424',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.svc.delete(id);

      Swal.fire({
        icon: 'success',
        title: 'Member deleted',
        showConfirmButton: false,
        timer: 1000,
      });
    });
  }
}
