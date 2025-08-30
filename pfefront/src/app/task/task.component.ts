import { CommonModule } from '@angular/common';
import { Component , EventEmitter, Input , OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Board } from '../kanbanboard/kanbanboard.component';
import { log } from 'console';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { UserService } from '../service/user.service';
import { TaskserviceService } from '../service/taskservice.service';
import { stat } from 'fs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,CardModule ,ButtonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit ,OnChanges{
   @Input() message: any = {};
   @Input() data :any ;
  @Input() board !:Board 
  @Input() columnName !:string
   @Input() index :any
   @Output() deleteEvent = new EventEmitter<Board>();
   isModalOpen = false;
   avatar= "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
 
 myName :any 
 
 myImage :any
 userName : any
 constructor(private userService :UserService ,private taskservice : TaskserviceService ,
  private router: Router
 ){

 }
  ngOnChanges(changes: SimpleChanges): void {

console.log("el changes",changes)

    console.log("ena fil on chaneges ", this.columnName)
   // this.changeStatus(this.columnName)

  }
 
 
 
 
 
 
   ngOnInit(){
  this.getMe()
 }


 delete()
 { 
  this.taskservice.delete(this.message.id).subscribe(res=>{
 let index =this.board.columns.findIndex(col => col.name == this.columnName)

  var newBoard : Board ;
  console.log(this.board.columns[index].tasks.splice(this.index,1))
  })

  }
 


    //this.deleteEvent.emit( newBoard)

  
 

openModal()
{
this.isModalOpen = true;
console.log("ena fi task")
console.log(this.index)
console.log(this.columnName)
console.log(this.message)
}




 getMe()
  {
    
    let useremail = localStorage.getItem('email');
    if(useremail)
    this.userName = useremail ;

    this.userService.getUserByEmail(   this.userName  ).subscribe(info =>{
     // console.log("info info info",info)
      this.myName = info.name
      this.myImage = info.avatarUrl
    //  console.log("my image",this.myImage)

    })
  }

closeModal(): void {
    this.isModalOpen = false;
  }





 getPriorityClass(priority: string): string {
    const classes = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
       return classes[priority as keyof typeof classes];
  }


goTodetails(p :any){
   
       // this.router.navigate(['/ticketDetails',p.id]);
          this.router.navigate(['/ticketDetails']);
    

    }


changeStatus(status : any)
{
  let task :any= {id : this.message.id ,
                  status :status
  }
 // console.log("ttttttttttttt",task)
  // this.taskservice.updateStatus(task).subscribe(res =>{
  //   console.log(res)
  // })

}

}
