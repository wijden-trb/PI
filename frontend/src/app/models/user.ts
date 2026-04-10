export type Role = 'STUDENT' | 'COMPANY'|'ADMIN';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  skills?: string;
  cvUrl?: string;
}
