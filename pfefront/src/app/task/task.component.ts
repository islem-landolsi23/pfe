import { CommonModule } from '@angular/common';
import { Component , EventEmitter, Input , OnInit, Output } from '@angular/core';
import { Board } from '../kanbanboard/kanbanboard.component';
import { log } from 'console';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,CardModule ,ButtonModule],
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
   avatar= "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
