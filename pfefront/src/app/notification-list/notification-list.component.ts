import { Component, OnInit, HostListener, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { PrimeIcons, MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationDTO } from "../service/chat.service";
import { Router } from '@angular/router';
import { NotificationdataService } from "../service/notificationdata.service";
import { NotificationService } from "../service/notification.service";
@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule ,AvatarModule, OverlayBadgeModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
    animations: [
    trigger("dropdownAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(-10px)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
      ]),
      transition(":leave", [
        animate("200ms ease-in", style({ opacity: 0, transform: "translateY(-10px)" }))
      ])
    ])
  ]
})
export class NotificationListComponent implements OnInit ,OnChanges{
constructor(private router: Router , private notificationdataservice :NotificationdataService,
  private updtaenotif :NotificationService
){

 }

    goToRout(notification :any)
  {
   this.router.navigate(['/ticketDetails']);
  
    
  }

@Input() clicked :boolean =false ;
@Input() ListTaskNotification :NotificationDTO[] | undefined ;

     isOpen = false;
  notifications: Notification[] = []
  //  [ {
  //     id: "1",
  //     taskName: "New Project Assignment",
  //     assignedDate: new Date(),
  //     priority: "High",
  //     status: "unread"
  //   },
  //   {
  //     id: "2",
  //     taskName: "Meeting Reminder",
  //     assignedDate: new Date(),
  //     priority: "Medium",
  //     status: "unread"
  //   },
  //   {
  //     id: "3",
  //     taskName: "Task Update Required",
  //     assignedDate: new Date(),
  //     priority: "Low",
  //     status: "read"
  //   }
  // ];
 ngOnInit(): void {


 }
 

   ngOnChanges(changes: SimpleChanges): void {
    if (changes['clicked'] && changes['clicked'].currentValue == true) {
      // whenever parent toggles clicked → open/close dropdown



this.ListTaskNotification?.forEach(el =>{
  let notification : Notification ={
    id : el.id,
    taskName: el.title,
  assignedDate: new Date(el.timestamp.substring(0, 16)),
  priority: el.message,
  status:  "unread",

  }
  this.notifications.push(notification)
})     
      this.toggleDropdown();}
  }
  get unreadCount(): number {
    return this.notifications.filter(n => n.status === "unread").length;
  }
  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element.closest(".relative")) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event?: Event): void {
   if (event) {
    event.stopPropagation();
  }
    this.isOpen = !this.isOpen;
  }

  markAsRead(notification: Notification, event: Event): void {
    let notDTo :NotificationDTO ={
      id: notification.id,
      title: "",
      message: "",
      receiverEmail: "",
      senderEmail: "",
      timestamp: "",
      type: "",
      taskUrl: undefined,
      isGroup: undefined
    }
    this.notificationdataservice.markMessageAsread(notDTo).subscribe(res=>{
  event.stopPropagation();
    notification.status = "read";
  const index=  this.notifications.indexOf(notification);
     this.notifications.splice(index,1)
     this.updtaenotif.updatedNotification(notDTo);
    })
  
  }

 

  getPriorityIconClass(priority: string): string {
    const baseClasses = "text-white";
    switch (priority) {
      case "High":
        return `${baseClasses} bg-red-500`;
      case "Medium":
        return `${baseClasses} bg-yellow-500`;
      case "Low":
        return `${baseClasses} bg-green-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }









    
  }



}
interface Notification {
  id: string;
  taskName: string;
  assignedDate: Date;
  priority: any;
  status: "read" | "unread";
}