
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



import { error } from 'console';
import { ChatMessage } from '../Entities/ChatMessage';
import { ChatService } from '../service/chat.service';
import { ConversationService } from '../service/conversation.service';
import { FileService } from '../service/file.service';
import { UserService } from '../service/user.service';




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
  conversationId :string ="";
  contacts :Contact[]= [
    {
      id: 1,
      name: 'Alice Johnson',
      email : "test@email.123",
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1',
      status: 'Online',
      lastMessage: 'Hey, how are you?',
      unread: 2
    },
    {
      id: 2,
      name: 'Bob Smith',
      email : "test@email.123",
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1',
      status: 'Offline',
      lastMessage: 'See you tomorrow!',
      unread: 0
    }
  ];

backendurl =  'http://localhost:8080'


  messages :ChatMessage[] = [
    
  ];

  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  constructor(
  private chatService: ChatService, private userService :UserService , 
  private conversationservice :ConversationService ,private fileservice :FileService
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
      res.forEach((element: { id: number; name: string;email :string, avatarUrl: string; }) => {
        
        let newconatc =new Contact(element.id,element.name,element.email,element.avatarUrl,"Online","lol",2)
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
   // console.log("el contact",contact)

if(this.getMyId()!=null){ 
  this.conversationservice.createOrGetPrivateChat(this.getMyId(),contact.id).subscribe(res=>{
     console.log("el grande americano",res)
        this.selectedContact = contact;
        this.conversationId =res.id ;
        this.getMessageConversation(res.id)




  },error =>{console.log("ena fil error ",error)}
   
  )

}
  
  else
    console.log("raj3it null")
 
  }

  // sendlocalMessage() {
  //   if (this.newMessage.trim()) {
  //     this.messages.push({
  //       text: this.newMessage,
  //       user: 'true',
  //       time: new Date()
  //     });
  //     console.log("send message local",this.messages)
  //     this.newMessage = '';
  //     setTimeout(() => {
  //       this.messages.push({
  //         text: "hiiiiiiiiiiiiiii",
  //         user: 'false',
  //         time: new Date()
  //       });
  //     }, 1000);
  //   }
  // }





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
     
      user: this.userName,
      timestamp: new Date().toDateString(),
        content : this.newMessage,
        conversationID :this.conversationId,
        receiverEmail: this.selectedContact.email

    } as  ChatMessage
    this.chatService.sendMessage("ABC", chatMessage);
     this.messages.push({
     
       user: this.userName,
         content: this.newMessage,
       timestamp: new Date().toString(),
       file_Url: '',
       conversationID: '',
       receiverEmail:'',
       fileType: 'TEXT'
     });
           console.log("send message lo5ra",this.messages)
    this.newMessage = '';
  
    
  }



 

   
  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
      console.log("ena el bandoura el 7amra",messages)
  

       this.messages = messages.map((item: any)=> ({
        ...item,
     
      }))
    });
  }
  



getMessageConversation(id:any)
{
  this.conversationservice.getMessagesByConversation(id).subscribe(res=>{

    console.log("fanta fata fanat",res)
  
        this.messages = res.map((item: any)=> ({
        ...item,
      //  message_side: item.user === this.userName ? 'sender': 'receiver'
      }))
  })
}



getMyId()
{
  
  let myemail =  localStorage.getItem('email');

 let me = this.contacts.find(el =>el.email == myemail);
 if (me)
  return me.id ;
else return null;
}

 onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.uploadFile(file);
  }
}

uploadFile(file: File) {
 console.log("batiiiiista")

 this.fileservice.saveFile(file).subscribe(res=>{
let fileType= this.detectFileType(res.fileUrl)
console.log("el file url",res.fileUrl,"elfile type")
    const chatMessage = {
     
      user: this.userName,
      timestamp: new Date().toDateString(),
        content : "",
        conversationID :this.conversationId,
        receiverEmail: this.selectedContact.email,
        file_Url :res.fileUrl,
        fileType:fileType

    } as  ChatMessage

      this.chatService.sendMessage("ABC", chatMessage);
      this.messages.push(chatMessage)
 })

 
}



private detectFileType(fileName: string): string {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
    return 'image';
  } else if (lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.ogg')) {
    return 'audio';
  } else if (lower.endsWith('.mp4') || lower.endsWith('.mov')) {
    return 'video';
  } else if (lower.endsWith('.pdf')) {
    return 'pdf';
  }
  return 'file';
}


}




class Contact {
  id: number;
  name: string;
  email:string;
  avatar:string ;
   status: string;
    lastMessage: string;
      unread: number ;




  constructor(id : number,name : string,email :string ,avatar :string, status : string,lastMessage : string,unread : number) {
    this.id=id
   this.name= name;
   this.email =email
this.avatar=avatar
    this.status= status;
     this.lastMessage= lastMessage;
      this. unread= unread ;
  }

 
}