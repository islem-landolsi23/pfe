
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, signal, OnDestroy } from '@angular/core';
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
import { ChatService, NotificationDTO } from '../service/chat.service';
import { ConversationService } from '../service/conversation.service';
import { FileService } from '../service/file.service';
import { UserService } from '../service/user.service';
import { NotificationService } from '../service/notification.service';
import { CallService } from '../service/call.service';
import { NotificationdataService } from '../service/notificationdata.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FileUploadModule,
    IconFieldModule,InputIconModule,PopoverModule,TextareaModule,FormsModule,InputTextModule,CardModule,AvatarModule,ScrollPanelModule ,
    SplitterModule,ButtonModule,PanelModule,ScrollPanelModule,InputText,ListboxModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent  implements OnInit, AfterViewChecked ,OnDestroy {


  outgoingCall = signal<any | null>(null);





  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  searchQuery: string = '';
  newMessage: string = '';
  selectedContact: any = null;
  conversationId :string ="";
  contacts :Contact[]= [
   
  ];

backendurl =  'http://localhost:8080'


  messages :ChatMessage[] = [
    
  ];
  email: any;
  myName :any
  myImage :any ;


  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  constructor(
  private chatService: ChatService, private userService :UserService , 
  private conversationservice :ConversationService ,private fileservice :FileService,
   private notificationService :NotificationService , private callSvc: CallService ,
   private notificationDataservice :NotificationdataService
)
{

}


setNotification(email: any) {
  this.notificationDataservice.getNotification(email).subscribe(res => {
    let notificationMap: Map<string, number> = new Map();

    res.forEach(el => {
      const sender = el.senderEmail; 
      if (!notificationMap.has(sender)) {
        notificationMap.set(sender, 1);
      } else {
        let value = notificationMap.get(sender) || 0;
        notificationMap.set(sender, value + 1);
      }
    });

    console.log("notificationMap", notificationMap);

    notificationMap.forEach((value, key) => {
      const contact = this.contacts.find(c => c.email == key && c.email !== this.selectedContact.email);
      if (contact) {
        contact['unread'] = value;
      }
    });
  });
}

  private subscription !: Subscription;

  ngOnInit() {




    let useremail = localStorage.getItem('email');
    if(useremail)
    this.userName = useremail ;
   this.getAllUsers()
this.getMe()
   
//this.chatService.joinRoom("ABC");
    this.lisenerMessage();

     this.subscription = this.chatService.getNotifications().subscribe(( notifications)=>{

       console.log("listenint to notification")
       this.setNotification(this.userName)
     })
  }


  getAllUsers()
  {
    this.userService.getAllUsers().subscribe(res=>{
      console.log("all users", res)
      res.forEach((element: { id: number; name: string;email :string, avatarUrl: string; }) => {
        
        let newconatc =new Contact(element.id,element.name,element.email,element.avatarUrl,"Online","",0)
        this.contacts.push(newconatc)
      });
       
    this.selectedContact = this.contacts.find(c=> c.email == this.userName);
    this.selectContact( this.selectedContact);
    this.setNotification(this.userName)
    })
  }

  getMe()
  {

    this.userService.getUserByEmail(  this.userName ).subscribe(info =>{
      console.log("info info info",info)
      this.myName = info.name
      this.myImage = info.avatarUrl
      console.log("my image",this.myImage)

    })
  }

call() {
 
        this.outgoingCall.set({ toEmail: this.selectedContact.email, type: 'CALL' });
         this.notificationService.openPopUp( this.outgoingCall())
    this.callSvc.publish({ fromEmail: this.userName, toEmail: this.selectedContact.email, type: 'CALL' });

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
   console.log("el contact",contact)

if(this.getMyId()!=null){ 
  this.conversationservice.createOrGetPrivateChat(this.getMyId(),contact.id).subscribe(res=>{
     console.log("el grande americano",res)
        this.selectedContact = contact;
        this.conversationId =res.id ;
          this.chatService.joinRoom(res.id);
        this.getMessageConversation(res.id);
        this.markasRead(contact.email,this.userName)
       
  this.chatService.setActiveChatUser(contact.email);

       




  },error =>{console.log("ena fil error ",error)}
   
  )

}
  
  else
    console.log("raj3it null")
 
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
  
     this.chatService.sendMessage( this.conversationId, chatMessage);
    //  this.messages.push({
     
    //    user: this.userName,
    //      content: this.newMessage,
    //    timestamp: new Date().toString(),
    //    file_Url: '',
    //    conversationID: '',
    //    receiverEmail:'',
    //    fileType: 'TEXT'
    //  });
     
           console.log("send message lo5ra",this.messages)
    this.newMessage = '';
  
    
  }



 

   
  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {
    


      this.messages = [...this.messages, ...messages.map((item: any) => ({ ...item }))];

    
    });
  }
  



getMessageConversation(id:any)
{
  this.conversationservice.getMessagesByConversation(id).subscribe(res=>{

  
  
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

      this.chatService.sendMessage(this.conversationId, chatMessage);
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



markasRead(senderEmail :any,receiverEmail :any)
{
let notificatinoDto :NotificationDTO ={
    title: "delete",
  message: "delete",
  receiverEmail: receiverEmail,
  senderEmail : senderEmail ,
  timestamp: "no one care",
  type :"still dont care" ,
  taskurl : null
}

this.notificationDataservice.markListAsread(notificatinoDto).subscribe(res=>{
  console.log("done") 

    const contact = this.contacts.find(c => c.email === senderEmail);
      if (contact) {
        contact['unread'] = 0;
      }
})
}

getImagePath(image:any)
{
if(this.isGitAvatar(image))
  return image ;
else
  return this.backendurl +image
}
      isGitAvatar(url: string): boolean {
   
  if (!url) return false; // handle empty or null
  // Check if the URL contains a GitHub domain (or other git provider)
  return url.includes('githubusercontent.com') || url.includes('gitlab.com') || url.includes('bitbucket.org');
}

ngOnDestroy() {
  this.chatService.setActiveChatUser(null);
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