import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VideoCallService } from '../service/video-call.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
type PCMap = Map<string, RTCPeerConnection>;
type StreamMap = Map<string, MediaStream>;
type QueueMap = Map<string, RTCIceCandidateInit[]>;
@Component({
  selector: 'app-meetingroom',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meetingroom.component.html',
  styleUrl: './meetingroom.component.scss'
})
export class MeetingroomComponent implements OnInit{
   @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  roomId!: string;
  //me = 'user-' + Math.floor(Math.random() * 1_000_000);
  me :any

  localStream!: MediaStream;
  peers: PCMap = new Map();                 
  remoteStreams: StreamMap = new Map();     
  candidateQueues: QueueMap = new Map();    
  remoteIds: string[] = [];    

  private isStompReady = false;

  constructor(
    private route: ActivatedRoute,
    private signaling: VideoCallService
  ) {}

  async ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') ?? 'room1';
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
   this.me = localStorage.getItem('email');

    // attach local video preview
    queueMicrotask(() => {
      this.localVideo.nativeElement.srcObject = this.localStream;
    });

    // Connect to STOMP
    this.signaling.connect(
      this.roomId,
      (msg) => this.onSignal(msg),
      () => {
        this.isStompReady = true;
        // Safe to send join now
        this.send({ type: 'join', sender: this.me });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isStompReady) {
      this.send({ type: 'leave', sender: this.me });
    }
    this.cleanupAll();
    this.signaling.disconnect();
  }

  // --- Signaling helpers ---
  private send(msg: SignalMessage) {
    if (!this.isStompReady) {
      console.warn('⚠️ STOMP not ready, skipping send', msg);
      return;
    }
    this.signaling.send(this.roomId, msg);
  }

  private async onSignal(msg: SignalMessage) {
    if (msg.sender === this.me) return;

    switch (msg.type) {
      case 'join': {
        const remoteId = msg.sender;
        if (!this.peers.has(remoteId)) {
          await this.ensurePeer(remoteId);
          await this.makeAndSendOffer(remoteId);
        }
        break;
      }
      case 'offer': {
        if (msg.target !== this.me) return;
        const remoteId = msg.sender;
        const pc = await this.ensurePeer(remoteId);

        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        await this.flushCandidateQueue(remoteId);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        this.send({ type: 'answer', sender: this.me, target: remoteId, data: answer });
        break;
      }
      case 'answer': {
        if (msg.target !== this.me) return;
        const remoteId = msg.sender;
        const pc = this.peers.get(remoteId);
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        await this.flushCandidateQueue(remoteId);
        break;
      }
      case 'candidate': {
        if (msg.target !== this.me) return;
        const remoteId = msg.sender;
        const pc = this.peers.get(remoteId);
        const candidate = new RTCIceCandidate(msg.data);

        if (pc?.remoteDescription) {
          try { await pc.addIceCandidate(candidate); } 
          catch (e) { console.warn('Failed ICE candidate add:', e); }
        } else {
          const q = this.candidateQueues.get(remoteId) ?? [];
          q.push(msg.data);
          this.candidateQueues.set(remoteId, q);
        }
        break;
      }
      case 'leave': {
        const remoteId = msg.sender;
        this.removePeer(remoteId);
        break;
      }
    }
  }

  // --- Peer creation & offer sending ---
  private async ensurePeer(remoteId: string): Promise<RTCPeerConnection> {
    let pc = this.peers.get(remoteId);
    if (pc) return pc;

    pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        this.send({ type: 'candidate', sender: this.me, target: remoteId, data: ev.candidate.toJSON() });
      }
    };

    const remoteStream = new MediaStream();
    this.remoteStreams.set(remoteId, remoteStream);
    this.refreshRemoteIds();

    pc.ontrack = (ev) => {
      ev.streams[0]?.getTracks().forEach(t => remoteStream.addTrack(t));
    };

    this.localStream.getTracks().forEach(track => pc!.addTrack(track, this.localStream));
    this.peers.set(remoteId, pc);
    return pc;
  }

  private async makeAndSendOffer(remoteId: string) {
    const pc = this.peers.get(remoteId)!;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.send({ type: 'offer', sender: this.me, target: remoteId, data: offer });
  }

  private async flushCandidateQueue(remoteId: string) {
    const pc = this.peers.get(remoteId);
    if (!pc || !pc.remoteDescription) return;

    const q = this.candidateQueues.get(remoteId);
    if (!q || q.length === 0) return;

    for (const c of q) {
      try { await pc.addIceCandidate(new RTCIceCandidate(c)); } 
      catch (e) { console.warn('Failed to flush queued ICE candidate:', e); }
    }
    this.candidateQueues.delete(remoteId);
  }

  // --- Cleanup ---
  private removePeer(remoteId: string) {
    const pc = this.peers.get(remoteId);
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      try { pc.getSenders().forEach(s => pc.removeTrack(s)); } catch {}
      pc.close();
      this.peers.delete(remoteId);
    }
    this.remoteStreams.delete(remoteId);
    this.candidateQueues.delete(remoteId);
    this.refreshRemoteIds();
  }

  private cleanupAll() {
    Array.from(this.peers.keys()).forEach(id => this.removePeer(id));
    try { this.localStream.getTracks().forEach(t => t.stop()); } catch {}
  }

  private refreshRemoteIds() {
    this.remoteIds = Array.from(this.remoteStreams.keys());
  }
 
}
export interface SignalMessage {
  type: 'join' | 'offer' | 'answer' | 'candidate' | 'leave';
  sender: string;
  target?: string;
  data?: any;
}