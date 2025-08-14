import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  ElementRef, ViewChild } from '@angular/core';
//import * as Stomp from 'stompjs';
import { Client, Stomp ,IMessage } from '@stomp/stompjs';
//import * as SockJS from 'sockjs-client';

import SockJS from 'sockjs-client'
@Component({
  selector: 'app-multiple-call',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './multiple-call.component.html',
  styleUrl: './multiple-call.component.scss'
})
export class MultipleCallComponent implements  OnInit   {
    @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  stompClient!: Client;
  localStream!: MediaStream;
  peers: { [id: string]: RTCPeerConnection } = {};
  myId = Math.random().toString(36).substring(2, 15);
  roomId = 'room1';

  async ngOnInit() {
    console.log("component init, myId=", this.myId);
    await this.startLocalStream();
    this.connectWebSocket();
  }

  async startLocalStream() {
    console.log("Requesting local media...");
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    console.log("Local stream started:", this.localStream.getTracks().map(t => t.kind));
    const video = document.createElement('video');
    video.srcObject = this.localStream;
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    document.body.appendChild(video);
  }

  connectWebSocket() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log(str),
    });

    this.stompClient.onConnect = () => {
      console.log("Connected to server");
      // Subscribe to the room topic
      this.stompClient.subscribe(`/topic/room/${this.roomId}`, (msg: IMessage) => {
        const signal = JSON.parse(msg.body);
        if (signal.from === this.myId) return; // ignore own messages
        console.log("Received signal:", signal);
        this.handleSignal(signal);
      });

      // Announce join
      this.stompClient.publish({
        destination: '/app/signal',
        body: JSON.stringify({ type: 'join', from: this.myId, roomId: this.roomId })
      });
    };

    this.stompClient.activate();
  }

  handleSignal(signal: any) {
    switch (signal.type) {
      case 'join':
        this.createPeer(signal.from, true);
        break;
      case 'offer':
        this.createPeer(signal.from, false, signal.data);
        break;
      case 'answer':
        this.peers[signal.from].setRemoteDescription(JSON.parse(signal.data));
        break;
      case 'candidate':
        this.peers[signal.from].addIceCandidate(new RTCIceCandidate(JSON.parse(signal.data)));
        break;
    }
  }

  createPeer(peerId: string, isInitiator: boolean, offerData?: string) {
    if (this.peers[peerId]) return;

    const pc = new RTCPeerConnection();
    this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));

    pc.ontrack = (event) => {
     // const video = document.createElement('video');
        let video = document.getElementById(peerId) as HTMLVideoElement | null;
        if(!video)
    {
    video = document.createElement('video');
    video.id = peerId;
    video.autoplay = true;
    video.playsInline = true;
    video.width = 300;
    video.height = 200;
    document.body.appendChild(video);
  }
   video.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.stompClient.publish({
          destination: '/app/signal',
          body: JSON.stringify({
            type: 'candidate',
            from: this.myId,
            roomId: this.roomId,
            data: JSON.stringify(event.candidate)
          })
        });
      }
    };

    this.peers[peerId] = pc;

    if (isInitiator) {
      pc.createOffer()
        .then(offer => {
          pc.setLocalDescription(offer);
          this.stompClient.publish({
            destination: '/app/signal',
            body: JSON.stringify({
              type: 'offer',
              from: this.myId,
              roomId: this.roomId,
              data: JSON.stringify(offer)
            })
          });
        });
    } else if (offerData) {
      pc.setRemoteDescription(JSON.parse(offerData))
        .then(() => pc.createAnswer())
        .then(answer => {
          pc.setLocalDescription(answer);
          this.stompClient.publish({
            destination: '/app/signal',
            body: JSON.stringify({
              type: 'answer',
              from: this.myId,
              roomId: this.roomId,
              data: JSON.stringify(answer)
            })
          });
        });
    }
  }





  leaveCall() {
  console.log('Leaving call...');

  // Close all peer connections
  Object.values(this.peers).forEach(pc => {
    pc.getSenders().forEach(sender => pc.removeTrack(sender));
    pc.close();
  });
  this.peers = {};

  // Stop local media tracks
  if (this.localStream) {
    this.localStream.getTracks().forEach(track => track.stop());
  }

  // Disconnect from websocket
  if (this.stompClient && this.stompClient.active) {
    this.stompClient.deactivate();
  }

  // Remove all remote videos
  const remoteVideos = document.getElementById('remoteVideos');
  if (remoteVideos) {
    remoteVideos.innerHTML = '';
  }

  // Remove local video srcObject
  if (this.localVideo && this.localVideo.nativeElement) {
    this.localVideo.nativeElement.srcObject = null;
  }

  console.log('Left the call and cleaned up');
}

}

interface SignalMessage {
  type: string;
  from: string;
  to: string;
  roomId: string;
  data?: any;
}