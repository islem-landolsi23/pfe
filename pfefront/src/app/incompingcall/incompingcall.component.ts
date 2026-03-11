import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CallService } from '../service/call.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incompingcall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incompingcall.component.html',
  styleUrl: './incompingcall.component.scss'
})
export class IncompingcallComponent implements OnInit ,OnChanges {

  @Input()
  showMe: boolean;

constructor( private callservice :CallService){

}

  ngOnInit() {
      
  }
  ngOnChanges(changes: SimpleChanges) {
  
    const currentEmail = localStorage.getItem("email")
    if(currentEmail)

   {
    
     this.callservice.listenToCalls(currentEmail).subscribe(res=>{
    

    })
   }
  }




}
