import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class CallService {


    private stompClient: Client;
  private incomingCall$ = new Subject<any>();

  constructor() {

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg)
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WS');
    };

    this.stompClient.activate(); 
   }


     listenToCalls(userEmail: string) {
    this.stompClient.onConnect = () => {
      this.stompClient.subscribe(`/topic/call/${userEmail}`, (message) => {
        this.incomingCall$.next(JSON.parse(message.body));
      });
    };
    return this.incomingCall$.asObservable();
  }

    startCall(fromEmail: string, toEmail: string) {
    this.stompClient.publish({
      destination: `/app/call/${toEmail}`,
      body: JSON.stringify({ fromEmail, toEmail, type: 'CALL' })
    });
  }

  
respondToCall(fromEmail: string, toEmail: string, response: 'ACCEPTED' | 'DECLINED') {
  this.stompClient.publish({
    destination: `/app/call/${fromEmail}`, // send back to caller
    body: JSON.stringify({ fromEmail: toEmail, toEmail: fromEmail, type: response })
  });
}
}
type Signal =
  | { fromEmail: string; toEmail: string; type: 'CALL'|'ACCEPTED'|'DECLINED' }
  | { fromEmail: string; toEmail: string; type: 'SDP_OFFER'|'SDP_ANSWER'; sdp: string }
  | { fromEmail: string; toEmail: string; type: 'ICE'; candidate: { candidate: string; sdpMid: string; sdpMLineIndex: number } };
