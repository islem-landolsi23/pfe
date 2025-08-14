import { Component , ElementRef, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Peer, { MediaConnection } from 'peerjs';
import { PeerService } from '../service/peer.service';
@Component({
  selector: 'app-videocall',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './videocall.component.html',
  styleUrl: './videocall.component.scss'
})
export class VideocallComponent implements OnInit ,OnDestroy {


 @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('partnerVideo') partnerVideo!: ElementRef<HTMLVideoElement>;

  peerId!: string;
  targetPeerId: string = '';
  private peer!: Peer;
  private currentCall!: MediaConnection;


    private ws!: WebSocket;
  private localStream!: MediaStream;
  private peerConnections: { [id: string]: any } = {};



   constructor(private peerService: PeerService) {}
  ngOnDestroy() {
   if (this.ws) this.ws.close();
    if (this.peer) this.peer.destroy();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
  
  
  
  
  async  ngOnInit() {
      this.peerId = this.peerService.initPeer();
    this.peer = this.peerService.getPeer();

      // Get local media stream
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.myVideo.nativeElement.srcObject = localStream;

    // Listen for incoming calls
    this.peer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (remoteStream) => {
        this.partnerVideo.nativeElement.srcObject = remoteStream;
      });
      this.currentCall = call;
    });
  }

//  ngOnInit(): void {
//     this.initializePeer();
//   }


    callPeer() {
      console.log("video call")
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = this.peer.call(this.targetPeerId, stream);
      call.on('stream', (remoteStream) => {
        this.partnerVideo.nativeElement.srcObject = remoteStream;
      });
      this.currentCall = call;
    });
  }

   endCall() {
      console.log("end call")
    if (this.currentCall) {
      this.currentCall.close();
    }
  }





  //  private initializePeer(): void {
  //   this.peer = new Peer();

  //   this.peer.on('open', (id) => {
  //     console.log('My PeerJS ID:', id);
  //     this.connectToSignalingServer(id);
  //     this.startLocalVideo();
  //   });

  //   this.peer.on('call', (call) => {
  //     call.answer(this.localStream);
  //     call.on('stream', (remoteStream) => {
  //       this.addVideoStream(remoteStream);
  //     });
  //   });
  // }



  //   private connectToSignalingServer(peerId: string): void {
  //   this.ws = new WebSocket('ws://localhost:8080/signal');

  //   this.ws.onopen = () => {
  //     console.log('Connected to signaling server');
  //     this.ws.send(JSON.stringify({ type: 'join', peerId }));
  //   };

  //   this.ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('Received:', data);

  //     if (data.type === 'existing-peers') {
  //       data.peers.forEach((id: string) => this.callPeerMultiple(id));
  //     }

  //     if (data.type === 'user-joined') {
  //       this.callPeerMultiple(data.peerId);
  //     }

  //     if (data.type === 'user-left') {
  //       if (this.peerConnections[data.peerId]) {
  //         this.peerConnections[data.peerId].close();
  //         delete this.peerConnections[data.peerId];
  //       }
  //     }
  //   };
  // }



  // private async startLocalVideo(): Promise<void> {
  //   try {
  //     this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     this.addVideoStream(this.localStream, true);
  //   } catch (err) {
  //     console.error('Error accessing camera/mic', err);
  //   }
  // }


  // private callPeerMultiple(peerId: string): void {
  //   const call = this.peer.call(peerId, this.localStream);
  //   this.peerConnections[peerId] = call;

  //   call.on('stream', (remoteStream) => {
  //     this.addVideoStream(remoteStream);
  //   });

  //   call.on('close', () => {
  //     console.log(`Call with ${peerId} closed`);
  //   });
  // }
  // private addVideoStream(stream: MediaStream, isLocal: boolean = false): void {
  //   const video = document.createElement('video');
  //   video.srcObject = stream;
  //   video.autoplay = true;
  //   video.playsInline = true;
  //   if (isLocal) video.muted = true;
  //   document.getElementById('video-container')?.appendChild(video);
  // }
}
