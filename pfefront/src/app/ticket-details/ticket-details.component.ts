import { Component, OnInit , HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";
import { PrimeIcons, MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule , AvatarModule, OverlayBadgeModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss',
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
export class TicketDetailsComponent implements OnInit{
    isOpen = false;
  notifications: Notification[] = [
    {
      id: "1",
      taskName: "New Project Assignment",
      assignedDate: new Date(),
      priority: "high",
      status: "unread"
    },
    {
      id: "2",
      taskName: "Meeting Reminder",
      assignedDate: new Date(),
      priority: "medium",
      status: "unread"
    },
    {
      id: "3",
      taskName: "Task Update Required",
      assignedDate: new Date(),
      priority: "low",
      status: "read"
    }
  ];
 ngOnInit(): void {}
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

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    notification.status = "read";
  }

  getPriorityIconClass(priority: string): string {
    const baseClasses = "text-white";
    switch (priority) {
      case "high":
        return `${baseClasses} bg-red-500`;
      case "medium":
        return `${baseClasses} bg-yellow-500`;
      case "low":
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
  priority: "low" | "medium" | "high";
  status: "read" | "unread";
}