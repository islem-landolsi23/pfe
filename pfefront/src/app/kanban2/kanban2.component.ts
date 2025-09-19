
import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, FormsModule, Validators } from "@angular/forms";
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { PrimeIcons, MenuItem } from 'primeng/api';
import { UserService } from "../service/user.service";
import { TaskserviceService } from "../service/taskservice.service";
import { ChatService } from "../service/chat.service";
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-kanban2',
  standalone: true,
  imports: [DragDropModule, CommonModule, FormsModule, Dialog, ButtonModule],
  templateUrl: './kanban2.component.html',
  styleUrl: './kanban2.component.scss'
})



export class Kanban2Component {



  @Input() sprintId: any;
  allUsers: any;
  users: any;
  ticketForm: FormGroup;
  visibledelete = false;
  constructor(private fb: FormBuilder, private userService: UserService
    , private taskservice: TaskserviceService, private chatservice: ChatService) {

    this.ticketForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      priority: ["Medium", Validators.required],
      status: ["Open", Validators.required],
      assignedTo: ["", Validators.required],
      dueDate: ["", Validators.required]
    });
  }



  // board = {
  //   columns: [
  //     {
  //       id: 'todo',
  //       name: 'To Do',
  //       tasks: [
  //         { title: 'Create login page', description: 'Implement using Angular + PrimeNG' },
  //         { title: 'Set up database', description: 'MongoDB on cloud' }
  //       ]
  //     },
  //     {
  //       id: 'inprogress',
  //       name: 'In Progress',
  //       tasks: [
  //         { title: 'API integration', description: 'Connect with backend' }
  //       ]
  //     },
  //     {
  //       id: 'done',
  //       name: 'Done',
  //       tasks: [
  //         { title: 'Project setup', description: 'Initial Angular scaffolding' }
  //       ]
  //     }
  //   ]
  // };

  // get connectedDropListsIds(): string[] {
  //   return this.board.columns.map(c => c.id);
  // }

  // onTaskDrop(event: CdkDragDrop<any[]>, column: any) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(column.tasks, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       column.tasks,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }




  columns: Column[] = [];
  selectedTask: Partial<Task> | null = null;
  isDarkMode = false;

  ngOnInit() {

    this.getAllUsers();
    this.loadInitialData();
    this.loadThemePreference();
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

          task.assignedTo = user

          let column = this.columns.find(c => c.title === task.status);
          if (column) {
            column.tasks.push(task);
          }

        })


      })

    }

  }



  loadInitialData() {


    this.columns = [
      { id: "1", title: "Open", isDefault: true, isEditing: false, tasks: [] },
      { id: "2", title: "In Progress", isDefault: true, isEditing: false, tasks: [] },
      { id: "3", title: "Resolved", isDefault: true, isEditing: false, tasks: [] },
      { id: "4", title: "Closed", isDefault: true, isEditing: false, tasks: [] },

    ];

    this.fillTable()
  }

  loadThemePreference() {
    this.isDarkMode = localStorage.getItem("theme") === "dark";
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    this.applyTheme();
  }

  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  drop(event: CdkDragDrop<Task[]>, columnName: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const index = event.currentIndex;
      const item = event.container.data[index];

      // ✅ Create a new object with updated status
      const updatedItem = {
        ...item,
        status: columnName
      };

      // ✅ Replace the object in the array (immutably)
      event.container.data[index] = updatedItem;

      // ✅ Pass the updated object
      this.changeTaskstatus(updatedItem);
    }
  }

  addColumn() {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: "New Column",
      isDefault: false,
      isEditing: true,
      tasks: []
    };
    this.columns.push(newColumn);
  }

  deleteColumn(column: Column) {
    if (confirm("Are you sure you want to delete this column?")) {
      this.columns = this.columns.filter(c => c.id !== column.id);
    }
  }



  saveColumnTitle(column: Column) {
    column.isEditing = false;
  }

  addTask(column: Column) {
    this.selectedTask = {
      title: "",
      description: "",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
      assignedTo: ""
    }
  }

  isGitAvatar(url: string): boolean {

    if (!url) return false; // handle empty or null
    // Check if the URL contains a GitHub domain (or other git provider)
    return url.includes('githubusercontent.com') || url.includes('gitlab.com') || url.includes('bitbucket.org');
  }

  getImagePath(image: any) {
    if (this.isGitAvatar(image))
      return image;
    else
      return 'http://localhost:8080' + image
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
  }

  tosktodelete: any
  columntodeletfrom: any
  showdeleteTask(task: Task, column: Column) {
    this.visibledelete = true;
    this.tosktodelete = task
    this.columntodeletfrom = column
    // if (confirm("Are you sure you want to delete this task?")) {
    //   this.columntodeletfrom.tasks = this.columntodeletfrom.tasks.filter(t => t.id !== this.tosktodelete);
    // }
  }

  deletetask() {

    //   this.columntodeletfrom.tasks = this.columntodeletfrom.tasks.filter(t => t.id !== this.tosktodelete.id);

    this.taskservice.delete(this.tosktodelete.id).subscribe(res => {
      //  let index =this.board.columns.findIndex(col => col.name == this.columnName)

      //   var newBoard : Board ;
      //   console.log(this.board.columns[index].tasks.splice(this.index,1))

      this.columntodeletfrom.tasks = this.columntodeletfrom.tasks.filter(t => t.id !== this.tosktodelete.id);

      this.visibledelete = false
    })


  }

  saveTask() {
    if (this.selectedTask && this.columns.length > 0) {
      if (!this.selectedTask.id) {
        const newTask = {
          ...this.selectedTask,
          id: Date.now().toString()
        } as Task;
        this.columns[1].tasks.push(newTask);
      } else {
        this.columns.forEach(column => {
          const taskIndex = column.tasks.findIndex(t => t.id === this.selectedTask?.id);
          if (taskIndex !== -1) {
            column.tasks[taskIndex] = { ...this.selectedTask as Task };
          }
        });
      }
      this.closeTaskModal();
    }
  }

  closeTaskModal() {
    this.selectedTask = null;
  }

  getPriorityClass(priority: string): string {
    const classes = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return classes[priority as keyof typeof classes];
  }
  changeTaskstatus(task: any) {
    console.log("ena fil el million dollar  bayby", task)
    this.taskservice.updateStatus(task).subscribe({
      next: (res) => console.log('Task updated:', res),
      error: (err) => console.error('Error updating task', err)
    });
  }

}
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: any
  dueDate: string;
  assignedTo: any
}

interface Column {
  id: string;
  title: string;
  isDefault: boolean;
  isEditing: boolean;
  tasks: Task[];
}