import { CommonModule } from '@angular/common';
import { Component , EventEmitter, Input , OnInit, Output } from '@angular/core';
import { Board } from '../kanbanboard/kanbanboard.component';
import { log } from 'console';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit{
   @Input() message: string = '';
   @Input() data :any ;
  @Input() board !:Board 
  @Input() columnName !:string
   @Input() index :any
   @Output() deleteEvent = new EventEmitter<Board>();
   isModalOpen = false;
 ngOnInit(){
  
 }


 delete()
 { let index =this.board.columns.findIndex(col => col.name == this.columnName)

  var newBoard : Board ;
  console.log(this.board.columns[index].tasks.splice(this.index,1))


    //this.deleteEvent.emit( newBoard)

  
 }

openModal()
{
this.isModalOpen = true;
console.log("ena fi task")
console.log(this.index)
console.log(this.columnName)
console.log(this.message)
}

closeModal(): void {
    this.isModalOpen = false;
  }











}
