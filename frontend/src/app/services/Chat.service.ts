import { Injectable } from '@angular/core';

import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient!: Client;

  connect(callback: any): void {

    this.stompClient = new Client({

      webSocketFactory: () =>
        new SockJS('http://localhost:8081/chat'),

      reconnectDelay: 5000,

      debug: (str) => {
        console.log(str);
      }
    });

    this.stompClient.onConnect = () => {

      console.log('Connected');

      this.stompClient.subscribe(
        '/topic/messages',
        (message) => {

          callback(
            JSON.parse(message.body)
          );
        }
      );
    };

    this.stompClient.activate();
  }

  sendMessage(message: any): void {

    if (this.stompClient.connected) {

      this.stompClient.publish({

        destination: '/app/sendMessage',

        body: JSON.stringify(message)
      });

    } else {

      console.error('STOMP not connected');
    }
  }
}
