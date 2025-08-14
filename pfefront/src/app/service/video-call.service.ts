import { Injectable } from '@angular/core';

import { Client, IMessage } from '@stomp/stompjs';
import  SockJS from 'sockjs-client';
import { SignalMessage } from '../meetingroom/meetingroom.component';
@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private stompClient!: Client;
  constructor() { }
  connect(roomId: string, onMessage: (msg: any) => void, onConnected?: () => void) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws`),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log('✅ STOMP connected');
      this.stompClient.subscribe(`/topic/${roomId}`, (message: IMessage) => {
        onMessage(JSON.parse(message.body));
      });

      if (onConnected) {
        onConnected(); // safe to send first message
      }
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    this.stompClient.activate();
  }

  send(roomId: string, message: SignalMessage) {
    if (!this.stompClient || !this.stompClient.active) {
      console.warn('⚠️ Cannot send: STOMP not connected yet', message);
      return;
    }
    this.stompClient.publish({
      destination: `/app/signal/${roomId}`,
      body: JSON.stringify(message)
    });
  }

  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('STOMP disconnected');
    }
  }

  isConnected(): boolean {
    return !!this.stompClient && this.stompClient.active;
  }

}