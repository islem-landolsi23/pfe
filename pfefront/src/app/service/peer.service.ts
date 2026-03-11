import { Injectable } from '@angular/core';
import Peer, { MediaConnection } from 'peerjs';
@Injectable({
  providedIn: 'root'
})
export class PeerService {
 private peer!: Peer;
  private myId!: string;
  constructor() { }
 initPeer(): string {
    this.peer = new Peer();
    this.peer.on('open', (id) => {
      this.myId = id;
      console.log('My peer ID is:', id);
    });
    return this.myId;
  }

   getPeer(): Peer {
    return this.peer;
  }
}
