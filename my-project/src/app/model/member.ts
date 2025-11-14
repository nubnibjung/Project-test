export type MemberStatus = 'Active' | 'Inactive';

export interface Member {
  id: number;
  name: string;
  email: string;
  mobile: string;
  photoUrl?: string;
  status: MemberStatus;
}