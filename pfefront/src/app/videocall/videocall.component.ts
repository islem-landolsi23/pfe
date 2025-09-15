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





}
