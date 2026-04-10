import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  newUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    skills: '',
    cvUrl: ''
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ✅ Fetch users from backend
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // ✅ Add new user
  addUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating user:', err);
      }
    });
  }

  // ✅ Delete user
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

  resetForm(): void {
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'STUDENT',
      skills: '',
      cvUrl: ''
    };
  }
}
