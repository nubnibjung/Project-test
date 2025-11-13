import { Injectable, computed, effect, signal } from '@angular/core';
import { Member } from '../model/member';

const STORAGE_KEY = 'members-demo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly STORAGE_KEY = 'members-data';

  private _members = signal<Member[]>([]);
  members = computed(() => this._members());

  constructor() {
    const raw = localStorage.getItem(this.STORAGE_KEY);

    if (raw) {
      this._members.set(JSON.parse(raw));
    } else {
      this._members.set(this.mockMembers());
    }

    // auto save
    effect(() => {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this._members())
      );
    });
  }

  add(member: Omit<Member, 'id'>) {
    const current = this._members();
    const nextId = current.length
      ? Math.max(...current.map((m) => m.id)) + 1
      : 1;

    this._members.set([
      ...current,
      { ...member, id: nextId },
    ]);
  }

  update(member: Member) {
    this._members.update((list) =>
      list.map((m) => (m.id === member.id ? member : m))
    );
  }

  delete(id: number) {
    this._members.update((list) => list.filter((m) => m.id !== id));
  }

  private mockMembers(): Member[] {
    return [
      {
        id: 1,
        name: 'George Lindelof',
        email: 'george@mail.com',
        mobile: '+1 345 23 21',
        status: 'Active',
        photoUrl: 'https://i.pravatar.cc/64?img=1'
      },
      {
        id: 2,
        name: 'Eric Dyer',
        email: 'eric@mail.com',
        mobile: '+1 222 23 44',
        status: 'Inactive',
        photoUrl: 'https://i.pravatar.cc/64?img=2'
      }
    ];
  }
}