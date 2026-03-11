import { Component ,OnInit  } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { log } from 'console';
import { TaskserviceService } from '../service/taskservice.service';
@Component({
  selector: 'app-kanbanboard',
  standalone: true,
  imports: [DragDropModule,TaskComponent,CommonModule],
  templateUrl: './kanbanboard.component.html',
  styleUrl: './kanbanboard.component.scss'
})
export class KanbanboardComponent implements OnInit{
  board!: Board;
constructor(private taskservice :TaskserviceService) {}
  ngOnInit()
  {
    this. fillme()
  const email = localStorage.getItem('email');
  if(email)
  {
    this.taskservice.getBygetByUser(email).subscribe(res=>{
      console.log("res",res)
    

      res.forEach( task =>{
          let taskToadd :Task ={
            id : task.id ,
        title: task.title,
        description: task.description,
        priority: task.priority ,
        dueDate : task.dueDate
      }
      this.board.addTask(task.status,taskToadd)
       

      })
    })
  }
//this.fillme()
  }
//  "Open", "In Progress", "Resolved", "Closed"
  fillme(){
  this.board = new Board('Test Board', [
    new Column('Open', [
     
   
    ]),
    new Column('In Progress', [
    
    ]),
    
    new Column('Resolved', [
    
      
    ]),
    new Column('Closed', [
   
   
    ])
  ]);
  }


    drop(event: CdkDragDrop<Task[]>,column?: any) {
     
    if (event.previousContainer === event.container) {
      console.log("same array")

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
       console.log("diffrent array")
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);


           // Get dropped task
      const task = event.container.data[event.currentIndex];
      let toupdate :any ={
        id :task.id ,
        status :  column.name,
          title:"",
  description:"",
   
     priority:"",
     createdAt:"",
     dueDate :"",
     sprintId:"",
     assignedUserId :"",
      }
      console.log("el to updatet",toupdate)

      this.changeTaskstatus(toupdate)
  
   
    }
  }
  click(column :any,index: any,event: any)
  {

console.log(column.name);

this.removeTask(this.board,column.name,index)



  }
   removeTask(board: Board, columnName: string, taskToRemoveIndex: any) {
    
 let index =board.columns.findIndex(col => col.name == columnName)


 
}
getConnectedDropLists() {
  return this.board.columns.map((_, index) => `cdk-drop-list-${index}`);
}

changeTaskstatus(task:any){
 this.taskservice.updateStatus(task).subscribe({
        next: (res) => console.log('Task updated:', res),
        error: (err) => console.error('Error updating task', err)
      });
    }
  }




export class Column {
    constructor(public name: string, public tasks: Task[]) {}
}


export class Board {
    constructor(public name: string, public columns: Column[]) {}


      addTask(columnName: string, task: Task): void {
    const column = this.columns.find(c => c.name === columnName);
    if (column) {
      column.tasks.push(task);
    } else {
      console.error(`Column ${columnName} not found`);
    }
  }
}

export class Task {
    constructor(public id :any ,public title: string, public description :string ,public priority :string ,public dueDate:string) {}
}