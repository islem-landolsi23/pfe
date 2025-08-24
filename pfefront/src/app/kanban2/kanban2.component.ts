
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { PrimeIcons, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-kanban2',
  standalone: true,
  imports: [DragDropModule,CommonModule , FormsModule],
  templateUrl: './kanban2.component.html',
  styleUrl: './kanban2.component.scss'
})



export class Kanban2Component {
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
    this.loadInitialData();
    this.loadThemePreference();
  }

  loadInitialData() {
    const mockTasks: Task[] = [
      {
        id: "t1",
        title: "Implement Authentication",
        description: "Set up user authentication system",
        priority: "High",
        dueDate: "2024-02-15",
        assignee: {
          name: "John Doe",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      }
    ];

    this.columns = [
      { id: "1", title: "Backlog", isDefault: true, isEditing: false, tasks: [] },
      { id: "2", title: "To Do", isDefault: true, isEditing: false, tasks: mockTasks },
      { id: "3", title: "In Progress", isDefault: true, isEditing: false, tasks: [] },
      { id: "4", title: "Review", isDefault: true, isEditing: false, tasks: [] },
      { id: "5", title: "Done", isDefault: true, isEditing: false, tasks: [] }
    ];
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

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
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
      assignee: {
        name: "Unassigned",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    };
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
  }

  deleteTask(task: Task, column: Column) {
    if (confirm("Are you sure you want to delete this task?")) {
      column.tasks = column.tasks.filter(t => t.id !== task.id);
    }
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

}
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
}

interface Column {
  id: string;
  title: string;
  isDefault: boolean;
  isEditing: boolean;
  tasks: Task[];
}