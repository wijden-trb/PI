import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../services/Chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages: any[] = [];

  message = '';

  currentUser: any;

  constructor(
    private chatService: ChatService
  ) {}

  ngOnInit(): void {

    this.currentUser = JSON.parse(
      localStorage.getItem('currentUser')!
    );

    this.chatService.connect((msg: any) => {

      this.messages.push(msg);

    });
  }

  send(): void {

    if (!this.message.trim()) return;

    this.chatService.sendMessage({

      sender: this.currentUser.firstName,

      content: this.message

    });

    this.message = '';
  }
}
