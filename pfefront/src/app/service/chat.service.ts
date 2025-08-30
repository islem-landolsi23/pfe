import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../Entities/ChatMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any
  private messageSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private notificationsSubject = new BehaviorSubject<NotificationDTO[]>([]);
  constructor() { 

       this. initConnenctionSocket() 
  }




  
  initConnenctionSocket() {
    const url = 'http://localhost:8080/ws';
    
    // Create a SockJS connection to your server's WebSocket endpoint
    const socket = new SockJS(url);
    // Wrap the SockJS connection with Stomp
    console.log("hani d5alite")
    this.stompClient = Stomp.over(socket)

      // Connect only once
  this.stompClient.connect({}, () => {
    console.log("Connected to WebSocket");
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




  sendMessage(roomId: string, chatMessage: ChatMessage) {
    console.log("room ID",roomId);
    
      
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
      let notification : NotificationDTO ={

        message : chatMessage.content ,
        receiverEmail : chatMessage.receiverEmail ,
        timestamp : chatMessage.timestamp ,
        title : "test message",
        type :"chat Notification",
        senderEmail :chatMessage.user ,
        taskurl : null


      } ;
      

      this.sendNotification(chatMessage.receiverEmail,notification)
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
      console.log("lebron james lebron james ",notifications)
      const current = this.notificationsSubject.getValue();
      this.notificationsSubject.next(notifications);
      console.log("Notification received:", notifications);
    });
  }




  // Subscribe for this user only
// subscribeToNotifications(userEmail: string) {
//   console.log("notificatino recived email",userEmail)
//   if (!this.stompClient || !this.stompClient.connected) {
//     console.error("WebSocket not connected yet");
//     return;
//   }
// //  /queue/notifications/${userEmail}
//   this.stompClient.subscribe(`/user/queue/notifications`, (message: any) => {
//     const notification: NotificationDTO = JSON.parse(message.body);
//     const current = this.notificationsSubject.getValue();
//     this.notificationsSubject.next([...current, notification]);
//     console.log("Notification received for user:", userEmail, notification);
//   });
// }


  getNotifications(): Observable<NotificationDTO[]> {
    return this.notificationsSubject.asObservable();
  }

  // Optional: send a notification (frontend-initiated)
  // sendNotification(receiverEmail: string, notification: NotificationDTO) {
  //   this.stompClient.send(`/app/notify/${receiverEmail}`, {}, JSON.stringify(notification));
  // }



  sendNotification(receiverEmail: string, notification: NotificationDTO) {
  this.stompClient.send(`/app/notify/${receiverEmail}`, {}, JSON.stringify(notification));
}
}

export interface NotificationDTO {
  title: string;
  message: string;
  receiverEmail: string;
  senderEmail : string ;
  timestamp: string;
  type :string ;
  taskurl :any 
}



