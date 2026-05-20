import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user';

import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChatComponent
  ],

  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: User = {

    id: 0,

    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
    skills: '',
    cvUrl: ''
  };

  isDarkMode = false;

  showChat = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const user =
      localStorage.getItem('currentUser');

    if (user) {

      this.profile = JSON.parse(user);
    }
  }

  toggleTheme(): void {

    this.isDarkMode = !this.isDarkMode;

    document.body.classList.toggle(
      'dark-mode',
      this.isDarkMode
    );
  }

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('currentUser');

    this.router.navigate(['/']);
  }

  toggleChat(): void {

    this.showChat = !this.showChat;
  }

  onSubmit(): void {

    this.userService.updateUser(
      this.profile.id!,
      this.profile
    ).subscribe({

      next: (res) => {

        localStorage.setItem(
          'currentUser',
          JSON.stringify(res)
        );

        alert('Profile updated');
      },

      error: (err) => {

        console.error(err);

        alert('Update failed');
      }
    });
  }

  //getCvViewUrl(url: string): string {

    //return url;
 // }
}
