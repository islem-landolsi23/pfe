import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../environments/environment ';
@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  private client!: Client;
  private connected = false;
  constructor() { }

//connect methode
  connect(myUserId: string, onMessage: (msg: CallSignalMsg) => void) {
    if (this.connected) return;

    this.client = Stomp.over(() => new SockJS(environment.wsUrl));
    this.client.reconnectDelay = 3000;

    this.client.onConnect = () => {
      this.connected = true;
      this.client.subscribe(`/topic/call.${myUserId}`, (frame: IMessage) => {
        const body = JSON.parse(frame.body) as CallSignalMsg;
        onMessage(body);
      });
    };

    this.client.onStompError = (e) => console.error('STOMP error', e);

    this.client.activate();
  }


  //////////// send methode
    send(msg: CallSignalMsg) {
    if (!this.connected) throw new Error('STOMP not connected');
    this.client.publish({
      destination: '/app/call.signal',
      body: JSON.stringify(msg)
    });
  }

}




export type SignalType = 'OFFER' | 'ANSWER' | 'CANDIDATE' | 'END' | 'REJECT' | 'BUSY';

export interface IceCandidateMsg {
  candidate: string;
  sdpMid?: string;
  sdpMLineIndex?: number;
}

export interface CallSignalMsg {
  type: SignalType;
  callId: string;
  fromUserId: string;
  toUserId: string;
  sdp?: string;
  candidate?: IceCandidateMsg;
}