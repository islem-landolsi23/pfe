
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PopoverModule } from 'primeng/popover';
import { PanelModule } from 'primeng/panel';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms'
import { TextareaModule } from 'primeng/textarea';
import { InputText } from 'primeng/inputtext';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar'
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import { ChatMessage, ChatService } from '../chat.service';



@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FileUploadModule,
    IconFieldModule,InputIconModule,PopoverModule,TextareaModule,FormsModule,InputTextModule,CardModule,AvatarModule,ScrollPanelModule ,
    SplitterModule,ButtonModule,PanelModule,ScrollPanelModule,InputText,ListboxModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent  implements OnInit, AfterViewChecked  {








  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  searchQuery: string = '';
  newMessage: string = '';
  selectedContact: any = null;
  contacts = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1',
      status: 'Online',
      lastMessage: 'Hey, how are you?',
      unread: 2
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1',
      status: 'Offline',
      lastMessage: 'See you tomorrow!',
      unread: 0
    }
  ];




  messages = [
    {
      text: "Hi there!",
      sent: false,
      time: new Date(Date.now() - 3600000)
    },
    {
      text: "Hello! How are you?",
      sent: true,
      time: new Date(Date.now() - 3000000)
    },
    {
      text: "I'm doing great, thanks for asking!",
      sent: false,
      time: new Date(Date.now() - 2400000)
    }
  ];

  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  ngOnInit() {
    this.selectedContact = this.contacts[0];
     this.chatService.joinRoom("ABC");
    this.lisenerMessage();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
  }

  sendlocalMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        sent: true,
        time: new Date()
      });
      this.newMessage = '';
      setTimeout(() => {
        this.messages.push({
          text: 'Thanks for your message!',
          sent: false,
          time: new Date()
        });
      }, 1000);
    }
  }





  clicked = false ;

  textTosend="";
  open=false
  Roomname=""
  userName=""
  messageInput: string = '';
  messageList: any[] = [];
 
   @ViewChild('chatBody') chatBody!: ElementRef;


   searchTerm: string = '';

constructor(
  private chatService: ChatService
)
{
  // var global
  //  global = global || window
}
  // ngOnInit(): void {
   
  //   this.chatService.joinRoom("ABC");
  //   this.lisenerMessage();
  // }


  onClick()
  {
 this.sendMessage();
 // this.messageInput=""
  }
  openMessageBox()
  {
    this.open =!this.open
  }
  


  sendMessage() {
    console.log("el message ",this.messageInput);
    
    const chatMessage = {
      message: this.messageInput,
      user: this.userName
    }as ChatMessage
    this.chatService.sendMessage("ABC", chatMessage);
    this.messageInput = '';
    console.log("ena fi el send message",this.messageList);
    
  }



 

   
  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log("message list",this.messageList);
      
      this.messageList = messages.map((item: any)=> ({
        ...item,
        message_side: item.user === this.userName ? 'sender': 'receiver'
      }))
    });
  }
  



  handleFileUpload(event :any)
  {}
}


