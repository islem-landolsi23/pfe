import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: any
  private messageSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor() { 

       this. initConnenctionSocket() 
  }




  
  initConnenctionSocket() {
    const url = 'http://localhost:8080/ws';
    //   const socket = new SockJS('http://localhost:8080/ws');
    // Create a SockJS connection to your server's WebSocket endpoint
    const socket = new SockJS(url);
    // Wrap the SockJS connection with Stomp
    console.log("hani d5alite")
    this.stompClient = Stomp.over(socket)
  }




    joinRoom(roomId: string) {
    // Connect to the server
    this.stompClient.connect({}, ()=>{

      
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
        console.log("ttt room Id",roomId);
        

        console.log("im in .....");
        
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);

        this.messageSubject.next(currentMessage);

      })
    })
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    console.log("room ID",roomId);
    
      
      this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
    }
  
    getMessageSubject(){
      return this.messageSubject.asObservable();
    }
}
export interface ChatMessage {
    message: string;
    user: string;
  }
