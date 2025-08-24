import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CallService } from '../service/call.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../service/notification.service';


@Component({
  selector: 'app-audiocall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audiocall.component.html',
  styleUrl: './audiocall.component.scss'
})

export class AudiocallComponent implements OnInit {
  email = ''; currentUser = ''; // Replace with logged-in user email 
  incomingCall = signal<any | null>(null);
  outgoingCall = signal<any | null>(null);
  ringtone = new Audio("ringtone.mp3");
  @ViewChild('remoteAudio', { static: false }) remoteAudioRef!: ElementRef<HTMLAudioElement>;




  constructor(private callSvc: CallService , private notificationService :NotificationService) { this.getCurrentUser() }
  ngOnInit() {
    // this.callSvc.listenToCalls(this.currentUser).subscribe(async (msg: any) => {
    //   console.log(msg.type)
    //   switch (msg.type) {
    //     case 'CALL':
    //       this.incomingCall.set(msg);
    //       this.ringtone.currentTime = 3;
    //       this.ringtone.loop = true;
         
    //       this.ringtone.play().catch(() => { });
    //       break;
    //     case 'ACCEPTED':
    //       // I am caller; start WebRTC offer
    //       this.outgoingCall.set(msg);
    //       await this.callSvc.initPeer(true, msg.fromEmail, (s) => this.attachRemote(s));
    //       // fill fromEmail in ICE publishes
    //       (this.callSvc as any).publish =
    //         this.wrapPublishFrom(this.callSvc.publish.bind(this.callSvc),
    //           this.currentUser);
    //       await this.callSvc.makeOffer(this.currentUser, msg.fromEmail); break;
    //     case 'DECLINED':
    //       this.outgoingCall.set(msg);
    //       this.callSvc.cleanup();
    //       break;
    //     case 'SDP_OFFER': // I am callee; create answer 
    //       await this.callSvc.initPeer(false, msg.fromEmail, (s) => this.attachRemote(s));
    //       (this.callSvc as any).publish = this.wrapPublishFrom(this.callSvc.publish.bind(this.callSvc),
    //         this.currentUser); await this.callSvc.handleOffer(msg, this.currentUser);
    //       break;
    //     case 'SDP_ANSWER':
    //       await this.callSvc.handleAnswer(msg); break;
    //     case 'ICE':
    //       await this.callSvc.handleIce(msg); break;
    //   }
    // });
  }



  private attachRemote(stream: MediaStream) {
    if (this.remoteAudioRef?.nativeElement) {
      this.remoteAudioRef.nativeElement.srcObject = stream;
      this.remoteAudioRef.nativeElement.play().catch(() => { });
    }
  }
  // helper so we don't forget fromEmail when sending ICE 
  private wrapPublishFrom(orig: Function, fromEmail: string) { return (signal: any) => orig({ ...signal, fromEmail }); }
  call() {
 
        this.outgoingCall.set({ toEmail: this.email, type: 'CALL' });
         this.notificationService.openPopUp( this.outgoingCall())
    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: this.email, type: 'CALL' });

  }




  acceptCall() {
    this.ringtone.pause();
    const caller = this.incomingCall()!.fromEmail;
    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: caller, type: 'ACCEPTED' });
    this.incomingCall.set(null);
  }
  declineCall() {
    this.ringtone.pause();
    const caller = this.incomingCall()!.fromEmail; this.callSvc.publish({ fromEmail: this.currentUser, toEmail: caller, type: 'DECLINED' });
    this.incomingCall.set(null); 
    this.callSvc.cleanup();
  }
  getCurrentUser() {
    const email = localStorage.getItem("email")
    if (email) { this.currentUser = email }
  }

  ale9telifoun()
  {
    this.callSvc.cleanup();
     this.outgoingCall.set(null); 
  }

  hangup()
  {     console.log("ena fil hang up ")
     
     //  const caller = this.outgoingCall()!.fromEmail; 
    //   console.log(caller)
    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: this.email, type: 'HANG_UP' });
    //  this.ringtone.pause();

     
     this.outgoingCall.set(null); 
    this.callSvc.cleanup();
    
  }
}