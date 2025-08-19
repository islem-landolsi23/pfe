import { Component, OnInit, signal } from '@angular/core';
import { CallService } from '../service/call.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audiocall',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './audiocall.component.html',
  styleUrl: './audiocall.component.scss'
})
export class AudiocallComponent implements OnInit {
 email = '';
  currentUser = ''; // Replace with logged-in user email
  incomingCall = signal<any | null>(null);
   outgoingCall = signal<any | null>(null);

   audio = new Audio("ringtone.mp3"); 

  constructor(private callService: CallService) {
this.getCurrentUser()

}
  ngOnInit(){
      // listen for incoming calls
    this.callService.listenToCalls(this.currentUser).subscribe((call) => {
          if (call.type === 'CALL') {
      this.incomingCall.set(call);
      this.audio.loop = true;
      this.audio.play();
    }else if (call.type === 'ACCEPTED' || call.type === 'DECLINED') {
        // response to my outgoing call
        this.outgoingCall.set(call);
      }
    });
  }
  call() {
    this.callService.startCall(this.currentUser, this.email);
       this.outgoingCall.set({ toEmail: this.email, type: 'CALL' });
  }

  acceptCall() {
    this.audio.pause();
    this.callService.respondToCall(this.incomingCall()!.fromEmail, this.currentUser, 'ACCEPTED');
    this.incomingCall.set(null);
    alert('Call accepted (next step: WebRTC)');
  }

  declineCall() {
    this.audio.pause();
    this.callService.respondToCall(this.incomingCall()!.fromEmail, this.currentUser, 'DECLINED');
    this.incomingCall.set(null);
    alert('Call declined');
  }

  getCurrentUser()
  {

    const email = localStorage.getItem("email")
    if(email)
    {
      this.currentUser =email
    }
  }
}
