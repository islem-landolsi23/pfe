import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { StompSubscription } from '@stomp/stompjs';
@Injectable({
  providedIn: 'root'
})
export class CallService {


    private stompClient: Client;
  private incomingCall$ = new Subject<any>();
    private platformId = inject(PLATFORM_ID);

      // --- WebRTC bits ---
  pc: RTCPeerConnection | null = null;
  localStream: MediaStream | null = null;
  remoteStream: MediaStream | null = null

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
  publish(signal: Signal) {
    this.stompClient.publish({
      destination: `/app/call/${signal.toEmail}`,
      body: JSON.stringify(signal)
    });
  }


  
  // ---------- WebRTC helpers ----------
  async initPeer(isCaller: boolean, remoteEmail: string, onRemoteStream: (s: MediaStream)=>void):  Promise<RTCPeerConnection | null> {
    if (!isPlatformBrowser(this.platformId)) return null; // SSR guard

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
    });

    this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    this.localStream.getTracks().forEach(t => this.pc!.addTrack(t, this.localStream!));

    this.remoteStream = new MediaStream();
    this.pc.ontrack = (ev) => {
      ev.streams[0].getTracks().forEach(tr => this.remoteStream!.addTrack(tr));
      onRemoteStream(this.remoteStream!);
    };

    this.pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        this.publish({
          fromEmail: '', // filled by caller
          toEmail: remoteEmail,
          type: 'ICE',
          candidate: {
            candidate: ev.candidate.candidate,
            sdpMid: ev.candidate.sdpMid!,
            sdpMLineIndex: ev.candidate.sdpMLineIndex!
          }
        } as Signal);
      }
    };

    return this.pc;
  }

  async makeOffer(fromEmail: string, toEmail: string) {
    if (!this.pc) return;
    const offer = await this.pc.createOffer({ offerToReceiveAudio: true });
    await this.pc.setLocalDescription(offer);
    this.publish({ fromEmail, toEmail, type: 'SDP_OFFER', sdp: JSON.stringify(offer) });
  }

  async handleOffer(msg: SignalMessage, fromEmail: string) :Promise<void>{
    if (!this.pc) return;
    const remoteDesc = new RTCSessionDescription(JSON.parse(msg.sdp));
    await this.pc.setRemoteDescription(remoteDesc);
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    this.publish({ fromEmail, toEmail: msg.fromEmail, type: 'SDP_ANSWER', sdp: JSON.stringify(answer) });
  }

  async handleAnswer(msg: SignalMessage):Promise<void> {
    if (!this.pc) return;
    const remoteDesc = new RTCSessionDescription(JSON.parse(msg.sdp));
    await this.pc.setRemoteDescription(remoteDesc);
  }

  async handleIce(msg: Extract<Signal, {type:'ICE'}>) {
    if (!this.pc) return;
    await this.pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
  }

  cleanup() {
    this.pc?.getSenders().forEach(s => s.track?.stop());
    this.localStream?.getTracks().forEach(t => t.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
  }
}
type Signal =
  | { fromEmail: string; toEmail: string; type: 'CALL'|'ACCEPTED'|'DECLINED' }
  | { fromEmail: string; toEmail: string; type: 'SDP_OFFER'|'SDP_ANSWER'; sdp: string }
  | { fromEmail: string; toEmail: string; type: 'ICE'; candidate: { candidate: string; sdpMid: string; sdpMLineIndex: number } };



  export interface SignalMessage {
  type: 'CALL' | 'CALL_ACCEPTED' | 'CALL_DECLINED' | 'SDP_OFFER' | 'SDP_ANSWER' | 'ICE_CANDIDATE';
  fromEmail: string;
  toEmail: string;
  sdp: string;
  candidate: any;
}
