import { Component ,OnInit  } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { log } from 'console';
@Component({
  selector: 'app-kanbanboard',
  standalone: true,
  imports: [DragDropModule,TaskComponent,CommonModule],
  templateUrl: './kanbanboard.component.html',
  styleUrl: './kanbanboard.component.scss'
})
export class KanbanboardComponent implements OnInit{
  board!: Board;

  ngOnInit()
  {
  
//this.fillme()
  }

  fillme(){
  this.board = new Board('Test Board', [
    new Column('Ideas', [
      "Some random idea ",
      "This is another random idea",
      "build an awesome application"
    ]),
    new Column('Research', [
      "Lorem ipsum",
      "foo",
      "This was in the 'Research' column"
    ]),
    
    new Column('Todo', [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ]),
    new Column('Done', [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ])
  ]);
  }


    drop(event: CdkDragDrop<string[]>) {
      console.log("ele event",event)
    if (event.previousContainer === event.container) {
      console.log("same array")

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
       console.log("diffrent array")
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
  click(column :any,index: any,event: any)
  {
    console.log("el column",column);
    
    console.log("index",index);
    
console.log("el event",event);
//this.board.columns[column].tasks.splice(index,1)
console.log(column.name);

this.removeTask(this.board,column.name,index)



  }
   removeTask(board: Board, columnName: string, taskToRemoveIndex: any) {
    
 let index =board.columns.findIndex(col => col.name == columnName)

//console.log( board.columns[index].tasks.splice(taskToRemoveIndex,1))
 
}
}

export class Column {
    constructor(public name: string, public tasks: string[]) {}
}


export class Board {
    constructor(public name: string, public columns: Column[]) {}
}