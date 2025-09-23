import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, isPlatformBrowser, NgIf } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { PrimeIcons } from 'primeng/api';
import { Menubar, MenubarModule } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CallService } from './service/call.service';

import { IncompingcallComponent } from './incompingcall/incompingcall.component';
import { forkJoin, Subscription } from 'rxjs';
import { NotificationService } from './service/notification.service';
import { FormsModule } from '@angular/forms';
import { ChatService } from './service/chat.service';
import { NotificationdataService } from './service/notificationdata.service';
import { NotificationListComponent } from './notification-list/notification-list.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIf, FormsModule,
    ButtonModule, MenubarModule, Menubar,
    BadgeModule, AvatarModule, InputTextModule, IncompingcallComponent, NotificationListComponent,
    Ripple],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  items: MenuItem[] | undefined;
  private callSubscription?: Subscription;
  title = 'pfefront';
  isDropdownOpen = false;
  accepted = false;
  currentUser = ''; // Replace with logged-in user email
  private subscription!: Subscription;
  showPopup = false;
  inCall = false;
  incomingCall = signal<any | null>(null);
  outgoingCall = signal<any | null>(null);
  ringtone: any
  email: any
  openPopUp: any = null;
  callingMsg = true
  @ViewChild('remoteAudio', { static: false }) remoteAudioRef!: ElementRef<HTMLAudioElement>;
  generatedString!: string;

  meetingpopup = false
  joinpopup = false;
  meetingcode: any
  unreadNotificationsCount = 0;
  unreadMessagesCount = 0;
  notificationCount: number = 0; // 🔹 track badge
  ListTaskNotification: any[] = [];

  isOpen = false
  constructor(private authService: AuthService, private router: Router, private callSvc: CallService,
    private notificationService: NotificationService,
    private chatservice: ChatService, private notificationdataservice: NotificationdataService
  ) {




  }
  startlistening() {


    const email = localStorage.getItem("email")
    if (email) {

      this.currentUser = email
      this.ringtone = new Audio("ringtone.mp3");
      this.callSvc.listenToCalls(email).subscribe(async (msg: any) => {


        switch (msg.type) {
          case 'CALL':

            this.ringtone.currentTime = 3;
            this.ringtone.loop = true;
            this.ringtone.play().catch(() => { });
            this.incomingCall.set(msg);





            break;
          case 'ACCEPTED':
            // I am caller; start WebRTC offer
            this.outgoingCall.set(msg);
            this.callingMsg = false
            await this.callSvc.initPeer(true, msg.fromEmail, (s) => this.attachRemote(s));
            // fill fromEmail in ICE publishes
            (this.callSvc as any).publish =
              this.wrapPublishFrom(this.callSvc.publish.bind(this.callSvc),
                email);
            await this.callSvc.makeOffer(email, msg.fromEmail); break;
          case 'DECLINED':
            this.outgoingCall.set(msg);
            this.callingMsg = false
            this.callSvc.cleanup();
            break;
          case 'HANG_UP':
            //   this.outgoingCall.set(msg);
            this.ringtone.pause();
            this.incomingCall.set(null);
            this.callSvc.cleanup();
            this.accepted = false;
            break;
          case 'SDP_OFFER': // I am callee; create answer 
            await this.callSvc.initPeer(false, msg.fromEmail, (s) => this.attachRemote(s));
            (this.callSvc as any).publish = this.wrapPublishFrom(this.callSvc.publish.bind(this.callSvc),
              email); await this.callSvc.handleOffer(msg, email);
            break;
          case 'SDP_ANSWER':
            await this.callSvc.handleAnswer(msg); break;
          case 'ICE':
            await this.callSvc.handleIce(msg); break;
        }
      });
    }

  }

  initBadge(email: any, notification: any) {


    forkJoin({
      messages: this.notificationdataservice.getNotification(email),
      tasks: this.notificationdataservice.getTasksNotifications(email)
    }).subscribe({
      next: (result) => {

        this.unreadNotificationsCount = result.tasks.length;
        this.chatservice.activeChatUser$.subscribe(activeUserEmail => {

          if (activeUserEmail) {
            this.unreadMessagesCount = result.messages.filter(notifItem => notifItem.senderEmail != activeUserEmail).length

            if (notification.length != 0) {

              this.notificationdataservice.markMessageAsread(notification).subscribe(() => {


              })
            }
          }
          else { this.unreadMessagesCount = result.messages.length }


          // setbadges


          const notifMessageItem = this.items.find(i => i.label === 'Messages');
          notifMessageItem.badge = this.unreadMessagesCount.toString();
          const notifTasksItem = this.items.find(i => i.label === 'Notifications');
          notifTasksItem.badge = this.unreadNotificationsCount.toString();
          this.ListTaskNotification = result.tasks;



        })

      }
    })


    // this.notificationdataservice.getNotification(email)
    // .subscribe(res =>{





    // })
  }

  ngOnInit() {
    this.setNavbarElement()



    // 🔹 Subscribe to notification events


    this.generatedString = Math.random().toString(36).substring(2, 10).toUpperCase();

    this.notificationService.call$.subscribe(res => {

      this.openPopUp = res
      this.callingMsg = true
      //  this.outgoingCall=res
    })


    this.authService.currentEmail.subscribe(res => {

      const email = localStorage.getItem("email")
      if (email) {


        this.subscription = this.chatservice.getNotifications().subscribe((notifications) => {
          console.log("listenint to notification")



          this.initBadge(email, notifications)
        });
        this.startlistening()
      }
    })

    this.notificationService.tasknotificationupdated.subscribe(res => {
      console.log(" aj lee is back el res", res, "el email ", this.currentUser)
      if (res) {

        this.initBadge(this.currentUser, null)
      }
    })


  }



  setNavbarElement() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        path: 'user'

      },
      {
        label: 'My Tasks',
        icon: 'pi pi-th-large',
        path: '/kanban'
      },

      {
        label: 'Projects',
        icon: 'pi pi-briefcase',
        path: '/project'


      },
      {
        label: "Notifications",
        icon: 'pi pi-bell',
        badge: this.unreadNotificationsCount > 0 ? String(this.unreadNotificationsCount) : undefined,
        path: "Notifications"

      }, {
        label: "Messages",
        icon: 'pi pi-envelope',
        badge: this.unreadMessagesCount > 0 ? String(this.unreadMessagesCount) : undefined,
        path: '/chat'
      }
      , {
        label: "Meeting",
        icon: 'pi pi-video',
        path: '/meeting',


        items: [

          {
            label: 'Start meeting',
            icon: 'pi pi-play',
            path: 'startmeeting'

          },
          {
            label: 'Join meeting',
            icon: 'pi pi-users',
            path: 'join'
          },
        ]
      }
    ];
  }


  loginwithGit() {

    this.authService.loginWithGitHub()
  }

  logout() {
    this.authService.logout();


  }

  checkislogged() {


  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

  }

  goToRout(path: string) {

    console.log("this is wis bize", this.unreadMessagesCount)
    console.log("this is wis bize", this.unreadNotificationsCount)
    if (path && path != '/meeting' && path != 'startmeeting' && path != 'join' && path != 'Notifications')
      this.router.navigateByUrl(path);
    else {
      if (path == 'startmeeting')
        this.meetingpopup = true
      else if (path == 'join') {
        this.joinpopup = true;
      } else if (path == "Notifications") {
        this.isOpen = !this.isOpen
      }
    }

  }


  startMeeting() {
    this.meetingpopup = false
    // this.router.navigateByUrl("/meeting");
    this.router.navigate(['/meeting', this.generatedString]);
  }
  joinMeeting() {
    this.joinpopup = false

    //  this.router.navigateByUrl("/meeting");
    this.router.navigate(['/meeting', this.meetingcode]);
  }



  updateBadge(notifications: any[]) {
    const notifItem = this.items.find(i => i.label === 'Messages');
    if (notifItem) {
      this.notificationCount++;
      this.unreadMessagesCount++;
      let nbr = notifications.length
      notifItem.badge = this.notificationCount > 0 ? this.notificationCount.toString() : undefined;
      notifItem.badge = this.unreadMessagesCount > 0 ? nbr.toString() : undefined;
    }
  }
  setCurrentEmail() { }





  private attachRemote(stream: MediaStream) {
    if (this.remoteAudioRef?.nativeElement) {
      this.remoteAudioRef.nativeElement.srcObject = stream;
      this.remoteAudioRef.nativeElement.play().catch(() => { });
    }
  }
  // helper so we don't forget fromEmail when sending ICE 
  private wrapPublishFrom(orig: Function, fromEmail: string) { return (signal: any) => orig({ ...signal, fromEmail }); }

  // call() {
  //   this.callSvc.publish({ fromEmail: this.currentUser, toEmail: this.email, type: 'CALL' });
  //   this.outgoingCall.set({ toEmail: this.email, type: 'CALL' });
  // }




  acceptCall() {
    this.accepted = true;
    this.ringtone.pause();
    const caller = this.incomingCall()!.fromEmail;

    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: caller, type: 'ACCEPTED' });
    //  this.incomingCall.set(null);
  }
  declineCall() {
    this.accepted = false;
    this.ringtone.pause();
    const caller = this.incomingCall()!.fromEmail;
    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: caller, type: 'DECLINED' });
    this.incomingCall.set(null);
    this.callSvc.cleanup();
  }

  hangup() {

    this.accepted = false;

    const caller = this.openPopUp.toEmail;


    this.callSvc.publish({ fromEmail: this.currentUser, toEmail: caller, type: 'HANG_UP' });
    this.notificationService.closePopup()



    this.outgoingCall.set(null);
    this.callSvc.cleanup();

  }

  closePopUpJoin() {
    this.joinpopup = false;
  }
  closePopUpStart() {
    this.meetingpopup = false
  }


}
