
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
import { UserService } from '../user.service';



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
  contacts :Contact[]= [
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
      user: 'rr',
      time: new Date(Date.now() - 3600000)
    },
    {
      text: "Hello! How are you?",
      user: 'true',
      time: new Date(Date.now() - 3000000)
    },
    {
      text: "I'm doing great, thanks for asking!",
      user: 'false',
      time: new Date(Date.now() - 2400000)
    }
  ];

  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  constructor(
  private chatService: ChatService, private userService :UserService
)
{

}

  ngOnInit() {




    let useremail = localStorage.getItem('email');
    if(useremail)
    this.userName = useremail ;
   this.getAllUsers()

    
    this.selectedContact = this.contacts[0];
     this.chatService.joinRoom("ABC");
    this.lisenerMessage();
  }


  getAllUsers()
  {
    this.userService.getAllUsers().subscribe(res=>{
      console.log("all users", res)
      res.forEach((element: { id: number; name: string; avatarUrl: string; }) => {
        
        let newconatc =new Contact(element.id,element.name,element.avatarUrl,"Online","lol",2)
        this.contacts.push(newconatc)
      });
    })
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
        user: 'true',
        time: new Date()
      });
      console.log("send message local",this.messages)
      this.newMessage = '';
      setTimeout(() => {
        this.messages.push({
          text: "hiiiiiiiiiiiiiii",
          user: 'false',
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
    console.log("el message ",this.newMessage);
    
    const chatMessage = {
      text: this.newMessage,
      user: this.userName,
      time: new Date().toDateString()
    } as  ChatMessage
    this.chatService.sendMessage("ABC", chatMessage);
     this.messages.push({
        text: this.newMessage,
        user: this.userName,
        time: new Date()
      });
           console.log("send message lo5ra",this.messages)
    this.newMessage = '';
  
    
  }



 

   
  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log("ena el bandoura el 7amra",messages)
     // console.log("message list",this.messageList);
      
      // this.messageList = messages.map((item: any)=> ({
      //   ...item,
      //   message_side: item.user === this.userName ? 'sender': 'receiver'
      // }))

       this.messages = messages.map((item: any)=> ({
        ...item,
        message_side: item.user === this.userName ? 'sender': 'receiver'
      }))
    });
  }
  



  handleFileUpload(event :any)
  {}
}




class Contact {
  id: number;
  name: string;
  avatar:string ;
   status: string;
    lastMessage: string;
      unread: number ;




  constructor(id : number,name : string,avatar :string, status : string,lastMessage : string,unread : number) {
    this.id=id
   this.name= name;
this.avatar=avatar
    this.status= status;
     this.lastMessage= lastMessage;
      this. unread= unread ;
  }

 
}