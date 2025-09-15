
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PrimeIcons, MenuItem } from 'primeng/api';
import { UserService } from '../service/user.service';
import { TaskserviceService } from '../service/taskservice.service';
import { ChatService, NotificationDTO } from '../service/chat.service';
import { Kanban2Component } from '../kanban2/kanban2.component';
@Component({
  selector: 'app-jira-ticket-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Kanban2Component],
  templateUrl: './jira-ticket-card.component.html',
  styleUrl: './jira-ticket-card.component.scss'
})
export class JiraTicketCardComponent implements OnInit, OnChanges {



  @Input() sprintId: any;
  allUsers: any[] = [];
  tickets: any[] = [];
  filteredTickets: any[] = [];
  searchQuery: string = "";
  filterStatus: string = "";
  filterPriority: string = "";
  filterDate: string = "";
  showModal: boolean = false;
  editMode: boolean = false;
  currentTicket: any = null;
  ticketForm: FormGroup;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;

  statusOptions: string[] = ["Open", "In Progress", "Resolved", "Closed"];
  priorityOptions: string[] = ["High", "Medium", "Low"];
  users: string[] = [];

  table = true;

  constructor(private fb: FormBuilder, private userService: UserService
    , private taskservice: TaskserviceService, private chatservice: ChatService) {
    this.getAllUsers()
    this.ticketForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      priority: ["Medium", Validators.required],
      status: ["Open", Validators.required],
      assignedTo: ["", Validators.required],
      dueDate: ["", Validators.required]
    });
  }
  ngOnChanges(): void {
    // this.fillTable()
  }

  ngOnInit() {
    //this.loadMockData();
    this.fillTable()

    this.applyFilters();
  }


  fillTable() {

    console.log(this.sprintId)
    if (this.sprintId) {
      this.taskservice.getBySprint(this.sprintId).subscribe(res => {

        console.log("hello", res)
        res.forEach(el => {


          let task: any = {};
          task.id = el.id
          task.title = el.title
          task.status = el.status
          task.priority = el.priority
          task.dueDate = el.dueDate
          task.description = el.description
          task.createdAt = null
          let user = this.allUsers.find(u => u.id == el.assignedUserId)

          task.assignedTo = user.name
          this.tickets.push(task)
        })

        this.applyFilters();
      })

    }

  }


  openTicketModal() {
    this.editMode = false;
    this.currentTicket = null;
    this.ticketForm.reset({
      status: "Open",
      priority: "Medium"
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.ticketForm.reset();
  }
  loadMockData() {
    this.tickets = Array(50).fill(null).map((_, index) => ({
      id: `TIC-${index + 1000}`,
      title: `Sample Ticket ${index + 1}`,
      description: `This is a sample ticket description ${index + 1}`,
      priority: this.priorityOptions[Math.floor(Math.random() * 3)],
      status: this.statusOptions[Math.floor(Math.random() * 4)],
      assignedTo: this.users[Math.floor(Math.random() * 3)],
      createdDate: new Date(Date.now() - Math.random() * 10000000000),
      dueDate: new Date(Date.now() + Math.random() * 10000000000)
    }));
    this.totalItems = this.tickets.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.tickets];


    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.assignedTo.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(ticket => ticket.status === this.filterStatus);
    }

    if (this.filterPriority) {
      filtered = filtered.filter(ticket => ticket.priority === this.filterPriority);
    }

    if (this.filterDate) {
      const filterDate = new Date(this.filterDate);
      filtered = filtered.filter(ticket =>
        new Date(ticket.createdDate).toDateString() === filterDate.toDateString()
      );
    }

    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.startIndex = start;
    this.endIndex = Math.min(start + this.itemsPerPage, this.totalItems);
    this.filteredTickets = filtered.slice(start, this.endIndex);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "";
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "";
    }
  }



  editTicket(ticket: any) {
    this.editMode = true;
    this.currentTicket = ticket;
    this.ticketForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assignedTo,
      dueDate: new Date(ticket.dueDate).toISOString().split('T')[0]
    });
    this.showModal = true;
  }

  submitTicket() {
    if (this.ticketForm.valid) {
      let taskdto: TaskDTO = this.ticketForm.value;
      const formData = this.ticketForm.value;
      taskdto.sprintId = this.sprintId
      let username = this.ticketForm.get('assignedTo')?.value;
      let user = this.allUsers.find(u => u.name == username)
      taskdto.assignedUserId = user.id

      this.taskservice.addTask(taskdto).subscribe({
        next: (res) => {
          console.log("hello new world", res)

          let notificatinoDto: NotificationDTO = {
            id: null,
            title: "the task " + res.title + " was assigned to you ",
            type: "TaskNotification",
            senderEmail: "",
            isGroup: false,
            receiverEmail: user.email,
            taskUrl: null,
            message: res.priority,
            timestamp: new Date().toDateString()



          }
          this.chatservice.sendNotification(user.email, notificatinoDto)
        }, error: (err) => {
          console.log(err)
        }

      })



      if (this.editMode && this.currentTicket) {
        const index = this.tickets.findIndex(t => t.id === this.currentTicket.id);
        if (index !== -1) {
          this.tickets[index] = { ...this.currentTicket, ...formData };
        }
      } else {
        const newTicket = {
          id: `TIC-${this.tickets.length + 1000}`,
          ...formData,
          createdDate: new Date()
        };
        this.tickets.unshift(newTicket);
      }
      this.applyFilters();
      this.closeModal();
    }
  }

  viewTicketDetails(ticket: any) {
    // Implement ticket details view logic
    console.log("Viewing ticket:", ticket);
  }


  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      console.log("all users", res)
      this.allUsers = res
      res.forEach(el => {
        let name = el.name;
        this.users.push(name)
      })

    });

    console.log("users list", this.users)

  }


  kanban() {
    this.table = !this.table;
  }

}

export interface TaskDTO {

  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string
  sprintId: any;
  assignedUserId: any;
  dueDate: any
}


