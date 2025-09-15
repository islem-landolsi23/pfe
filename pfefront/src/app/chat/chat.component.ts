
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
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';





@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FileUploadModule,
    IconFieldModule, InputIconModule, PopoverModule, TextareaModule, FormsModule, InputTextModule, CardModule, AvatarModule, ScrollPanelModule,
    SplitterModule, ButtonModule, PanelModule, ScrollPanelModule, InputText, ListboxModule,Toast],
      providers: [MessageService]  ,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {


  outgoingCall = signal<any | null>(null);





  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  searchQuery: string = '';
  newMessage: string = '';
  selectedContact: any = null;
  conversationId: string = "";
  contacts: Contact[] = [

  ];
groupename :any ;
  backendurl = 'http://localhost:8080'


  messages: ChatMessage[] = [

  ];
  email: any;
  myName: any
  myImage: any;


  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  constructor(
    private chatService: ChatService, private userService: UserService,
    private conversationservice: ConversationService, private fileservice: FileService,
    private notificationService: NotificationService, private callSvc: CallService,
    private notificationDataservice: NotificationdataService,private messageService: MessageService
  ) {

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
    if (useremail)
      this.userName = useremail;
    this.getAllUsers()
    this.getMe()

    //this.chatService.joinRoom("ABC");
    this.lisenerMessage();

    this.subscription = this.chatService.getNotifications().subscribe((notifications) => {

      console.log("listenint to notification")
      this.setNotification(this.userName)
    })
  }


  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
     
      res.forEach((element: { id: number; name: string; email: string, avatarUrl: string; }) => {

        let newconatc = new Contact(element.id, element.name, element.email, element.avatarUrl, "Online", "", 0,false)
        this.contacts.push(newconatc)
      });

      this.selectedContact = this.contacts.find(c => c.email == this.userName);
      this.selectContact(this.selectedContact);
      this.setNotification(this.userName)
      this.getGroups()
    })
  }

  getMe() {

    this.userService.getUserByEmail(this.userName).subscribe(info => {
     
      this.myName = info.name
      this.myImage = info.avatarUrl
     

    })
  }

  call() {

    this.outgoingCall.set({ toEmail: this.selectedContact.email, type: 'CALL' });
    this.notificationService.openPopUp(this.outgoingCall())
    this.callSvc.publish({ fromEmail: this.userName, toEmail: this.selectedContact.email, type: 'CALL' });

  }






  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  selectContact(contact: any) {
   
if(contact.isGroup == false)
  { if (this.getMyId() != null) {
      this.conversationservice.createOrGetPrivateChat(this.getMyId(), contact.id).subscribe(res => {
      
        this.selectedContact = contact;
        this.conversationId = res.id;
        this.chatService.joinRoom(res.id);
        this.getMessageConversation(res.id);
        this.markasRead(contact.email, this.userName)

        this.chatService.setActiveChatUser(contact.email);

      }, error => { console.log("ena fil error ", error) }

      )

    }

    else
      console.log("raj3it null")

  }else{
     this.selectedContact = contact;
      this.conversationId = contact.id;
        this.chatService.setActiveChatUser(contact.email);
         this.getMessageConversation(contact.id);
           this.chatService.joinRoom(contact.id);
  }

}







  clicked = false;

  textTosend = "";
  open = false
  Roomname = ""
  userName = ""
  messageInput: string = '';
  messageList: any[] = [];

  @ViewChild('chatBody') chatBody!: ElementRef;


  searchTerm: string = '';





  onClick() {
    this.sendMessage();
    // this.messageInput=""
  }
  openMessageBox() {
    this.open = !this.open
  }



  sendMessage() {
 

    const chatMessage = {

      user: this.userName,
      timestamp: new Date().toDateString(),
      content: this.newMessage,
      conversationID: this.conversationId,
      receiverEmail: this.selectedContact.email

    } as ChatMessage

    this.chatService.sendMessage(this.conversationId, chatMessage,this.selectedContact.isGroup);
    //  this.messages.push({

    //    user: this.userName,
    //      content: this.newMessage,
    //    timestamp: new Date().toString(),
    //    file_Url: '',
    //    conversationID: '',
    //    receiverEmail:'',
    //    fileType: 'TEXT'
    //  });

   
    this.newMessage = '';


  }






  lisenerMessage() {
    this.chatService.getMessageSubject().subscribe((messages: any) => {



      this.messages = [...this.messages, ...messages.map((item: any) => ({ ...item }))];


    });
  }




  getMessageConversation(id: any) {
    this.conversationservice.getMessagesByConversation(id).subscribe(res => {



      this.messages = res.map((item: any) => ({
        ...item,
        //  message_side: item.user === this.userName ? 'sender': 'receiver'
      }))
    })
  }



  getMyId() {

    let myemail = localStorage.getItem('email');

    let me = this.contacts.find(el => el.email == myemail);
    if (me)
      return me.id;
    else return null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {


    this.fileservice.saveFile(file).subscribe(res => {
      let fileType = this.detectFileType(res.fileUrl)
    
      const chatMessage = {

        user: this.userName,
        timestamp: new Date().toDateString(),
        content: "",
        conversationID: this.conversationId,
        receiverEmail: this.selectedContact.email,
        file_Url: res.fileUrl,
        fileType: fileType

      } as ChatMessage

      this.chatService.sendMessage(this.conversationId, chatMessage,this.selectedContact.isGroup);
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



  markasRead(senderEmail: any, receiverEmail: any) {
    let notificatinoDto: NotificationDTO = {
      id : 401,
      title: "delete",
      message: "delete",
      receiverEmail: receiverEmail,
      senderEmail: senderEmail,
      timestamp: "no one care",
      type: "still dont care",
      isGroup : false ,
      taskUrl: null
    }

    this.notificationDataservice.markListAsread(notificatinoDto).subscribe(res => {
    

      const contact = this.contacts.find(c => c.email === senderEmail);
      if (contact) {
        contact['unread'] = 0;
      }
    })
  }

  getImagePath(image: any) {
    if (this.isGitAvatar(image))
      return image;
    else
      return this.backendurl + image
  }
  isGitAvatar(url: string): boolean {

    if (!url) return false; // handle empty or null
    // Check if the URL contains a GitHub domain (or other git provider)
    return url.includes('githubusercontent.com') || url.includes('gitlab.com') || url.includes('bitbucket.org');
  }

  ngOnDestroy() {
    this.chatService.setActiveChatUser(null);
  }


  ///////////////////////////////////// conversationgrope 


 isModalOpen = false;
  users: UserConversation[] = [
    
      
  ];


   openModal(): void {

this.contacts.forEach( el=>{


if(el.isGroup == false)
{
let user :UserConversation ={
     id: el.id,
  name: el.name,
  email: el.email,
  avatar: el.avatar,
  selected: false,
  }
  this.users.push(user)
}
})

    this.isModalOpen = true;
  }

  closeModal(): void {



   this.users = []
    this.isModalOpen = false;
   // this.getGroups()
  }

  getGroups()
  {
    this.conversationservice.getByGroup(this.getMyId()).subscribe(res=>{


let imgurl :string ="/uploads/2025081116093544.png"
      res.forEach(element =>{
       
 let newconatc = new Contact(element.id, element.title, element.title, imgurl, "Online", "", 0,true)
        this.contacts.push(newconatc)
      })
    

})
  }

  toggleSelection(user: UserConversation): void {
    user.selected = !user.selected;
  }

  saveSelection(): void {
    const selectedUsers = this.users.filter(user => user.selected);


    let listparticipent = selectedUsers.map(e => e.id)
    let createdby = this.getMyId()

    this.conversationservice.creatGroupe(listparticipent,createdby,this.groupename).subscribe({
      next: (res: any)=>{
      
       this.showSuccess()
    this.closeModal();
    },error: (err)=>{
     
      this.showerror(err.message)
    }})

  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
  }
   avatarUrl(url: string, size = 16): string {
  try {
    const u = new URL(url);
    // if (u.hostname.endsWith('images.unsplash.com')) {
      // Ask Unsplash for a small, square, face-cropped thumbnail
      u.searchParams.set('w', String(size));
      u.searchParams.set('h', String(size));
      u.searchParams.set('fit', 'crop');
      u.searchParams.set('crop', 'faces');   // center on faces when possible
      u.searchParams.set('auto', 'format');  // better format (webp/avif)
      u.searchParams.set('dpr', '2');        // crisp on HiDPI screens
   // }
    return u.toString();
  } catch {
    // Non-URL strings (e.g., relative paths) just return as-is
    return url;
  }
}

     showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

      showerror(text : string) {
        this.messageService.add({ severity: 'error', summary: 'error', detail: text });
    }


}




class Contact {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: string;
  lastMessage: string;
  unread: number;
  isGroup :boolean

  constructor(id: number, name: string, email: string, avatar: string, status: string, lastMessage: string, 
    unread: number,isGroup :boolean) {
    this.id = id
    this.name = name;
    this.email = email
    this.avatar = avatar
    this.status = status;
    this.lastMessage = lastMessage;
    this.unread = unread;
    this.isGroup =isGroup
  }


}
interface UserConversation {
  id: number;
  name: string;
  email: string;
  avatar: string;
  selected: boolean;
}