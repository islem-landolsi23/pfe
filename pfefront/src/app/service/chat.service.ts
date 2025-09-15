import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../Entities/ChatMessage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConversationService } from './conversation.service';
import { UserService } from './user.service';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any
  private messageSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
      private activeChatUserSource = new BehaviorSubject<string | null>(null);


        // Observable for subscribers (navbar, notification system, etc.)
  activeChatUser$ = this.activeChatUserSource.asObservable();
  constructor(private conversationservice :ConversationService , private userservice: UserService) { 

       this. initConnenctionSocket() 
  }

  setActiveChatUser(userEmail: string | null) {
    this.activeChatUserSource.next(userEmail);
  }


  
  initConnenctionSocket() {
    const url = 'http://localhost:8080/ws';
    
    // Create a SockJS connection to your server's WebSocket endpoint
    const socket = new SockJS(url);
    // Wrap the SockJS connection with Stomp
   
    this.stompClient = Stomp.over(socket)

      // Connect only once
  this.stompClient.connect({}, () => {
    console.log("Connected to WebSocket");
      console.log("listenint to notification");
      const currentUserEmail = localStorage.getItem('email'); // or however you store it
    if (currentUserEmail) {
      this.subscribeToNotifications(currentUserEmail);
    }
  });
  
  }






joinRoom(roomId: string) {
  if (!this.stompClient || !this.stompClient.connected) {
    console.error("Not connected yet");
    return;
  }

  console.log("Joining room:", roomId);

  this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
    console.log("Message received in room:", roomId);

    const messageContent = JSON.parse(messages.body);
    const currentMessage = this.messageSubject.getValue();
    currentMessage.push(messageContent);
    this.messageSubject.next(currentMessage);
  
  });
}




  sendMessage(roomId: string, chatMessage: ChatMessage,isGroup :boolean) {
    console.log("room ID",roomId);
    
   
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
      let notification : NotificationDTO ={
        id :roomId ,
        message : chatMessage.content ,
        receiverEmail : chatMessage.receiverEmail ,
        timestamp : chatMessage.timestamp ,
        title : "test message",
        type :"chat Notification",
        senderEmail :chatMessage.user ,
        isGroup : isGroup ,
        taskUrl : null


      } ;
      
      if(isGroup == false)
    {
    
       this.sendNotification(chatMessage.receiverEmail,notification)}
    else
    {
      notification.title = notification.receiverEmail
    this.sendMiltipleNotifications(notification)
    }
    }
  
    getMessageSubject(){
      
      return this.messageSubject.asObservable();
    }


     subscribeToNotifications(userEmail: string) {
     
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("WebSocket not connected yet");
      return;
    }

    this.stompClient.subscribe(`/queue/${userEmail}`, (messages) => {
      const notifications: NotificationDTO [] = JSON.parse(messages.body);
      
      const current = this.notificationsSubject.getValue();
      this.notificationsSubject.next(notifications);
      console.log("Notification received:", notifications);
    });
  }






  getNotifications(): Observable<NotificationDTO[]> {
    return this.notificationsSubject.asObservable();
  }


  sendMiltipleNotifications(notificatinoDto :NotificationDTO)
  {
   
    this.conversationservice.getById(notificatinoDto.id).subscribe(res=>{
      res.participants.forEach(el=>{
      
        notificatinoDto.senderEmail=notificatinoDto.title
        notificatinoDto.receiverEmail = el.email
           //notificatinoDto.senderEmail =notificatinoDto.receiverEmail
           notificatinoDto.type ="groupe"
         
        this.sendNotification(el.email,notificatinoDto)
      })
    });

  }
 



  sendNotification(receiverEmail: string, notification: NotificationDTO) {
console.log(notification)
    
  this.stompClient.send(`/app/notify/${receiverEmail}`, {}, JSON.stringify(notification));
}
}

export interface NotificationDTO {
  id:any
  title: string;
  message: string;
  receiverEmail: string;
  senderEmail : string ;
  timestamp: string;
  type :string ;
  taskUrl:any
  isGroup :any 
}



