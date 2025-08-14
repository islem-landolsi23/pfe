import { Injectable } from '@angular/core';
import { Client, Frame, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AudiocallService {

  private stompClient!: Client;
  private connected = false;

  private incomingCallSubject = new Subject<{ callerId: string; callerName: string }>();
  private callAcceptedSubject = new Subject<void>();
  private callDeniedSubject = new Subject<void>();

  incomingCall$ = this.incomingCallSubject.asObservable();
  callAccepted$ = this.callAcceptedSubject.asObservable();
  callDenied$ = this.callDeniedSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: (frame: Frame) => {
        console.log('Connected to WebSocket');
        this.connected = true;

        // Listen for incoming call requests
        this.stompClient.subscribe('/user/queue/audio-call', (message: IMessage) => {
          const callData = JSON.parse(message.body);
          this.incomingCallSubject.next(callData);
        });

        // Listen for call accepted
        this.stompClient.subscribe('/user/queue/audio-call-accepted', () => {
          this.callAcceptedSubject.next();
        });

        // Listen for call denied
        this.stompClient.subscribe('/user/queue/audio-call-denied', () => {
          this.callDeniedSubject.next();
        });
      }
    });

    this.stompClient.activate();
  }

  startCall(calleeId: string, callerName: string) {
    if (!this.connected) {
      console.error('STOMP connection not ready.');
      return;
    }

    const payload = { calleeId, callerName };
    this.stompClient.publish({ destination: '/app/audio-call', body: JSON.stringify(payload) });
  }

  acceptCall(callerId: string) {
    this.stompClient.publish({ destination: '/app/audio-call-accept', body: JSON.stringify({ callerId }) });
  }

  denyCall(callerId: string) {
    this.stompClient.publish({ destination: '/app/audio-call-deny', body: JSON.stringify({ callerId }) });
  }

}